package com.gramayatri.ui.timeline

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.gramayatri.data.models.Ping
import com.gramayatri.data.models.Stop
import java.text.SimpleDateFormat
import java.util.*

@Composable
fun BusTimeline(
    stops: List<Stop>,
    lastPing: Ping?,
    estimatedArrivals: Map<String, Long>,
    onPing: (String) -> Unit
) {
    Box(modifier = Modifier.fillMaxSize()) {
        // Draw connecting line
        Canvas(modifier = Modifier.fillMaxSize().padding(start = 24.dp)) {
            drawLine(
                color = Color.Gray.copy(alpha = 0.3f),
                start = Offset(0f, 0f),
                end = Offset(0f, size.height),
                strokeWidth = 2.dp.toPx()
            )
        }

        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(24.dp)
        ) {
            itemsIndexed(stops) { index, stop ->
                StopItem(
                    stop = stop,
                    isLast = index == stops.size - 1,
                    isBusHere = lastPing?.stopId == stop.id,
                    eta = estimatedArrivals[stop.id],
                    onPing = { onPing(stop.id) }
                )
            }
        }
    }
}

@Composable
fun StopItem(
    stop: Stop,
    isLast: Boolean,
    isBusHere: Boolean,
    eta: Long?,
    onPing: () -> Unit
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically
    ) {
        // Stop Indicator
        Box(
            modifier = Modifier.size(16.dp),
            contentAlignment = Alignment.Center
        ) {
            if (isBusHere) {
                Surface(
                    modifier = Modifier.size(12.dp),
                    shape = MaterialTheme.shapes.small,
                    color = Color.Red
                ) {}
            } else {
                Surface(
                    modifier = Modifier.size(8.dp),
                    shape = MaterialTheme.shapes.small,
                    color = Color.Gray
                ) {}
            }
        }

        Spacer(modifier = Modifier.width(16.dp))

        ElevatedCard(
            modifier = Modifier.weight(1f),
            shape = MaterialTheme.shapes.medium
        ) {
            Row(
                modifier = Modifier.padding(16.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Column {
                    Text(
                        text = stop.name,
                        fontWeight = FontWeight.Bold,
                        fontSize = 16.sp
                    )
                    Text(
                        text = stop.nameKannada,
                        fontSize = 12.sp,
                        color = Color.Gray
                    )
                    
                    eta?.let {
                        val time = SimpleDateFormat("HH:mm", Locale.getDefault()).format(Date(it))
                        AssistChip(
                            onClick = {},
                            label = { Text("ETA: $time", fontSize = 10.sp) },
                            colors = AssistChipDefaults.assistChipColors(
                                labelColor = Color(0xFFF59E0B)
                            )
                        )
                    }
                }

                Button(
                    onClick = onPing,
                    contentPadding = PaddingValues(horizontal = 12.dp, vertical = 4.dp),
                    shape = MaterialTheme.shapes.small
                ) {
                    Text("PING", fontSize = 10.sp, fontWeight = FontWeight.Black)
                }
            }
        }
    }
}
