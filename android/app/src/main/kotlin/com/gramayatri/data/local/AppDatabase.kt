package com.gramayatri.data.local

import androidx.room.*
import kotlinx.coroutines.flow.Flow

@Dao
interface RouteDao {
    @Transaction
    @Query("SELECT * FROM routes")
    fun getRoutesWithStops(): Flow<List<RouteWithStops>>

    @Transaction
    @Query("SELECT * FROM routes WHERE id = :routeId")
    fun getRouteWithStops(routeId: String): Flow<RouteWithStops?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertRoutes(routes: List<RouteEntity>)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertStops(stops: List<StopEntity>)

    @Query("DELETE FROM routes")
    suspend fun clearRoutes()

    @Query("DELETE FROM stops")
    suspend fun clearStops()
    
    @Transaction
    suspend fun syncRoutes(routes: List<RouteWithStops>) {
        clearRoutes()
        clearStops()
        insertRoutes(routes.map { it.route })
        insertStops(routes.flatMap { it.stops })
    }
}

@Database(entities = [RouteEntity::class, StopEntity::class], version = 1, exportSchema = false)
abstract class AppDatabase : RoomDatabase() {
    abstract fun routeDao(): RouteDao
}
