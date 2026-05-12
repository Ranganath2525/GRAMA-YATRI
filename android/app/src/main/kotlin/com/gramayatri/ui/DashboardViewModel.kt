package com.gramayatri.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.gramayatri.data.TransitRepository
import com.gramayatri.data.models.Ping
import com.gramayatri.data.models.Route
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

data class DashboardState(
    val routes: List<Route> = emptyList(),
    val currentRoute: Route? = null,
    val lastPing: Ping? = null,
    val estimatedArrivals: Map<String, Long> = emptyMap(),
    val isLoading: Boolean = true
)

class DashboardViewModel(private val repository: TransitRepository) : ViewModel() {

    private val _uiState = MutableStateFlow(DashboardState())
    val uiState: StateFlow<DashboardState> = _uiState.asStateFlow()

    init {
        loadRoutes()
        syncWithRemote()
    }

    private fun loadRoutes() {
        viewModelScope.launch {
            repository.getRoutes().collect { routesList ->
                _uiState.update { it.copy(routes = routesList, isLoading = routesList.isEmpty()) }
                if (_uiState.value.currentRoute == null && routesList.isNotEmpty()) {
                    selectRoute(routesList.first())
                }
            }
        }
    }

    private fun syncWithRemote() {
        viewModelScope.launch {
            // Initial manual sync
            try {
                repository.syncFirestoreToLocal()
            } catch (e: Exception) {
                // Handle or ignore if offline
            }
            
            // Continuous observation
            repository.observeFirestoreAndSync().collect {
                repository.syncFirestoreToLocal()
            }
        }
    }

    fun selectRoute(route: Route) {
        _uiState.update { it.copy(currentRoute = route) }
        observePings(route.id)
    }

    private fun observePings(routeId: String) {
        viewModelScope.launch {
            repository.getLatestPing(routeId).collect { ping ->
                _uiState.update { it.copy(lastPing = ping) }
                calculateETAs(ping)
            }
        }
    }

    private fun calculateETAs(ping: Ping?) {
        val route = _uiState.value.currentRoute ?: return
        if (ping == null) {
            _uiState.update { it.copy(estimatedArrivals = emptyMap()) }
            return
        }

        val arrivals = mutableMapOf<String, Long>()
        val reporterStop = route.stops.find { it.id == ping.stopId } ?: return
        
        route.stops.forEach { stop ->
            val travelTimeDiff = stop.avgTravelTimeMins - reporterStop.avgTravelTimeMins
            if (travelTimeDiff > 0) {
                arrivals[stop.id] = ping.timestamp + (travelTimeDiff * 60000L)
            }
        }
        
        _uiState.update { it.copy(estimatedArrivals = arrivals) }
    }

    fun reportPing(stopId: String) {
        val routeId = _uiState.value.currentRoute?.id ?: return
        viewModelScope.launch {
            repository.sendPing(
                Ping(
                    routeId = routeId,
                    stopId = stopId,
                    reporterName = "App User",
                    timestamp = System.currentTimeMillis()
                )
            )
        }
    }
}
