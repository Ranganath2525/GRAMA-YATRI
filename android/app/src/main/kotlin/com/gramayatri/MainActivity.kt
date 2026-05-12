package com.gramayatri

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.room.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.gramayatri.ui.DashboardViewModel
import com.gramayatri.ui.timeline.BusTimeline
import com.gramayatri.data.TransitRepository
import com.gramayatri.data.local.AppDatabase
import com.gramayatri.ui.theme.GramaYatriTheme
import com.google.firebase.firestore.FirebaseFirestore
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.lifecycle.viewmodel.compose.viewModel
import com.gramayatri.data.models.Route

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            GramaYatriTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    val db = FirebaseFirestore.getInstance()
                    val localDb = Room.databaseBuilder(
                        applicationContext,
                        AppDatabase::class.java, "grama-yatri-db"
                    ).build()
                    val repository = TransitRepository(db, localDb.routeDao())
                    val dashboardViewModel: DashboardViewModel = viewModel(
                        factory = object : androidx.lifecycle.ViewModelProvider.Factory {
                            override fun <T : androidx.lifecycle.ViewModel> create(modelClass: Class<T>): T {
                                @Suppress("UNCHECKED_CAST")
                                return DashboardViewModel(repository) as T
                            }
                        }
                    )
                    
                    val uiState by dashboardViewModel.uiState.collectAsState()
                    var searchQuery by remember { mutableStateOf("") }
                    
                    Column(modifier = Modifier.fillMaxSize()) {
                        // Search Header
                        TextField(
                            value = searchQuery,
                            onValueChange = { searchQuery = it },
                            modifier = Modifier.fillMaxWidth().padding(16.dp),
                            placeholder = { Text("Search Arsikere, Kadur, Hassan...") },
                            leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
                            shape = MaterialTheme.shapes.medium,
                            colors = TextFieldDefaults.colors(
                                focusedIndicatorColor = Color.Transparent,
                                unfocusedIndicatorColor = Color.Transparent
                            )
                        )

                        val filteredRoutes = uiState.routes.filter {
                            it.name.contains(searchQuery, ignoreCase = true) ||
                            it.district?.contains(searchQuery, ignoreCase = true) == true ||
                            it.taluk?.contains(searchQuery, ignoreCase = true) == true ||
                            it.keywords.any { k -> k.contains(searchQuery, ignoreCase = true) }
                        }

                        if (uiState.currentRoute == null) {
                            RouteList(
                                routes = filteredRoutes,
                                onSelect = { dashboardViewModel.selectRoute(it) }
                            )
                        } else {
                            Box(modifier = Modifier.weight(1f)) {
                                Column {
                                    RouteHeader(
                                        route = uiState.currentRoute!!,
                                        onBack = { dashboardViewModel.selectRoute(null) }
                                    )
                                    BusTimeline(
                                        stops = uiState.currentRoute!!.stops,
                                        lastPing = uiState.lastPing,
                                        estimatedArrivals = uiState.estimatedArrivals,
                                        onPing = { stopId -> 
                                            dashboardViewModel.reportPing(stopId)
                                        }
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun RouteList(routes: List<Route>, onSelect: (Route) -> Unit) {
    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        items(routes) { route ->
            ElevatedCard(
                onClick = { onSelect(route) },
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(route.name, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        "${route.source} → ${route.destination}",
                        fontSize = 12.sp,
                        color = Color.Gray
                    )
                    route.district?.let {
                        Text(
                            "District: $it • Taluk: ${route.taluk}",
                            fontSize = 10.sp,
                            color = Color.Gray.copy(alpha = 0.7f)
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun RouteHeader(route: Route, onBack: () -> Unit) {
    Surface(
        color = MaterialTheme.colorScheme.primaryContainer,
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(verticalAlignment = androidx.compose.ui.Alignment.CenterVertically) {
                IconButton(onClick = onBack) {
                    Icon(androidx.compose.material.icons.Icons.Default.ArrowBack, contentDescription = null)
                }
                Column {
                    Text(route.name, fontWeight = FontWeight.Bold)
                    Text("${route.source} to ${route.destination}", fontSize = 12.sp)
                }
            }
        }
    }
}
