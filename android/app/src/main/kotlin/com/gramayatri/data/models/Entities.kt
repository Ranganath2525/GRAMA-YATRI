package com.gramayatri.data.models

import com.google.firebase.firestore.PropertyName

data class Stop(
    val id: String = "",
    val name: String = "",
    val nameKannada: String = "",
    val distanceFromSourceKm: Double = 0.0,
    val avgTravelTimeMins: Int = 0,
    val lat: Double? = null,
    val lng: Double? = null
)

data class Route(
    val id: String = "",
    val name: String = "",
    val source: String = "",
    val destination: String = "",
    val busNumber: String? = null,
    val stops: List<Stop> = emptyList(),
    val estimatedTime: String? = null,
    val isPopular: Boolean = false,
    val category: String = "GENERAL",
    val district: String? = null,
    val taluk: String? = null,
    val keywords: List<String> = emptyList()
)

data class Ping(
    val routeId: String = "",
    val stopId: String = "",
    val reporterName: String = "",
    val timestamp: Long = 0L,
    val type: String = "PASSED",
    val status: String = "ON_TIME"
)
