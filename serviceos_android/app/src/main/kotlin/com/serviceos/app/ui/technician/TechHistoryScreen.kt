package com.serviceos.app.ui.technician

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.serviceos.app.core.theme.LocalExtraColors

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TechHistoryScreen(
    onBack: () -> Unit = {}
) {
    val extraColors = LocalExtraColors.current

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Pro Scorecard & Van Audit") },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surface
                )
            )
        },
        containerColor = MaterialTheme.colorScheme.background
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp)
                .verticalScroll(rememberScrollState()),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Scorecard Highlights
            Surface(
                color = MaterialTheme.colorScheme.surface,
                shape = RoundedCornerShape(20.dp),
                shadowElevation = 2.dp,
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Text("PLATINUM PRO PERFORMANCE", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = extraColors.rating)
                    Spacer(modifier = Modifier.height(4.dp))
                    Text("Technician Scorecard", style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Black))
                    Text("Certified Field Service Specialist • Active Status", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f))
                    Divider(modifier = Modifier.padding(vertical = 12.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Column {
                            Text("5.0 ★", fontWeight = FontWeight.Black, fontSize = 20.sp, color = extraColors.rating)
                            Text("Target CSAT", fontSize = 11.sp)
                        }
                        Column {
                            Text("100%", fontWeight = FontWeight.Black, fontSize = 20.sp, color = extraColors.verified)
                            Text("On-Time Rate", fontSize = 11.sp)
                        }
                        Column {
                            Text("100%", fontWeight = FontWeight.Black, fontSize = 20.sp, color = MaterialTheme.colorScheme.primary)
                            Text("First-Fix Rate", fontSize = 11.sp)
                        }
                    }
                }
            }

            // Daily Van Equipment Checklist
            Text("Van Tools & Safety Checklist", style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold))
            VanCheckItem("Rigid K-400 Drain Snaking Drum (Inspected)", true)
            VanCheckItem("Milwaukee M18 ProPEX Expansion Tool (100% Charge)", true)
            VanCheckItem("Digital Sewer Inspection Borescope (Operational)", true)
            VanCheckItem("OSHA Chemical Spill & Eye Wash Kit (Stocked)", true)
        }
    }
}

@Composable
private fun VanCheckItem(title: String, checked: Boolean) {
    Surface(
        color = MaterialTheme.colorScheme.surface,
        shape = RoundedCornerShape(12.dp),
        shadowElevation = 1.dp,
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier.padding(14.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(Icons.Default.CheckCircle, contentDescription = null, tint = MaterialTheme.colorScheme.primary)
            Spacer(modifier = Modifier.width(10.dp))
            Text(text = title, style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.SemiBold))
        }
    }
}
