package com.gramayatri.data

import com.gramayatri.data.local.RouteDao
import com.gramayatri.data.local.RouteWithStops
import com.gramayatri.data.local.asEntity
import com.gramayatri.data.local.asExternalModel
import com.gramayatri.data.models.Ping
import com.gramayatri.data.models.Route
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.Query
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.tasks.await

class TransitRepository(
    private val db: FirebaseFirestore,
    private val routeDao: RouteDao
) {

    fun getRoutes(): Flow<List<Route>> {
        return routeDao.getRoutesWithStops().map { entities ->
            entities.map { it.asExternalModel() }
        }
    }

    fun observeFirestoreAndSync() : Flow<Unit> = callbackFlow {
        val subscription = db.collection("routes")
            .addSnapshotListener { snapshot, _ ->
                snapshot?.let {
                    val routes = it.toObjects(Route::class.java)
                    trySend(Unit) 
                    // This Unit flow will be collected by ViewModel to trigger updateLocalCache
                }
            }
        awaitClose { subscription.remove() }
    }

    suspend fun syncFirestoreToLocal() {
        val snapshot = db.collection("routes").get().await()
        val routes = snapshot.toObjects(Route::class.java)
        updateLocalCache(routes)
    }

    suspend fun updateLocalCache(routes: List<Route>) {
        val routeEntities = routes.map { route ->
            RouteWithStops(
                route = route.asEntity(),
                stops = route.stops.map { it.asEntity(route.id) }
            )
        }
        routeDao.syncRoutes(routeEntities)
    }

    fun getLatestPing(routeId: String): Flow<Ping?> = callbackFlow {
        val subscription = db.collection("pings")
            .whereEqualTo("routeId", routeId)
            .orderBy("timestamp", Query.Direction.DESCENDING)
            .limit(1)
            .addSnapshotListener { snapshot, _ ->
                val ping = snapshot?.documents?.firstOrNull()?.toObject(Ping::class.java)
                trySend(ping)
            }
        awaitClose { subscription.remove() }
    }

    suspend fun sendPing(ping: Ping) {
        db.collection("pings").add(ping).await()
    }
}
