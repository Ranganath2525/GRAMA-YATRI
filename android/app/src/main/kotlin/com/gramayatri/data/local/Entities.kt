package com.gramayatri.data.local

import androidx.room.*
import com.gramayatri.data.models.Route
import com.gramayatri.data.models.Stop

@Entity(tableName = "routes")
data class RouteEntity(
    @PrimaryKey val id: String,
    val name: String,
    val source: String,
    val destination: String,
    val busNumber: String?,
    val estimatedTime: String?,
    val isPopular: Boolean,
    val category: String,
    val district: String?,
    val taluk: String?
)

@Entity(
    tableName = "stops",
    foreignKeys = [
        ForeignKey(
            entity = RouteEntity::class,
            parentColumns = ["id"],
            childColumns = ["routeId"],
            onDelete = ForeignKey.CASCADE
        )
    ],
    indices = [Index("routeId")]
)
data class StopEntity(
    @PrimaryKey(autoGenerate = true) val localId: Long = 0,
    val routeId: String,
    val id: String,
    val name: String,
    val nameKannada: String,
    val distanceFromSourceKm: Double,
    val avgTravelTimeMins: Int,
    val lat: Double?,
    val lng: Double?
)

data class RouteWithStops(
    @Embedded val route: RouteEntity,
    @Relation(
        parentColumn = "id",
        entityColumn = "routeId"
    )
    val stops: List<StopEntity>
)

fun RouteWithStops.asExternalModel(): Route = Route(
    id = route.id,
    name = route.name,
    source = route.source,
    destination = route.destination,
    busNumber = route.busNumber,
    stops = stops.sortedBy { it.distanceFromSourceKm }.map { it.asExternalModel() },
    estimatedTime = route.estimatedTime,
    isPopular = route.isPopular,
    category = route.category,
    district = route.district,
    taluk = route.taluk
)

fun StopEntity.asExternalModel(): Stop = Stop(
    id = id,
    name = name,
    nameKannada = nameKannada,
    distanceFromSourceKm = distanceFromSourceKm,
    avgTravelTimeMins = avgTravelTimeMins,
    lat = lat,
    lng = lng
)

fun Route.asEntity(): RouteEntity = RouteEntity(
    id = id,
    name = name,
    source = source,
    destination = destination,
    busNumber = busNumber,
    estimatedTime = estimatedTime,
    isPopular = isPopular,
    category = category,
    district = district,
    taluk = taluk
)

fun Stop.asEntity(routeId: String): StopEntity = StopEntity(
    routeId = routeId,
    id = id,
    name = name,
    nameKannada = nameKannada,
    distanceFromSourceKm = distanceFromSourceKm,
    avgTravelTimeMins = avgTravelTimeMins,
    lat = lat,
    lng = lng
)
