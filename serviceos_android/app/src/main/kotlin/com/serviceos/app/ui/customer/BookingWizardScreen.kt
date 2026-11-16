package com.serviceos.app.ui.customer

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BookingWizardScreen(
    onBack: () -> Unit = {},
    onConfirmed: () -> Unit = {},
    baseLabor: Double = 0.0,
    dispatchFee: Double = 0.0
) {
    var step by remember { mutableStateOf(1) } // 1: Problem, 2: Address, 3: Schedule, 4: Payment
    var issueDetails by remember { mutableStateOf("") }
    var serviceAddress by remember { mutableStateOf("") }
    var accessNotes by remember { mutableStateOf("") }
    val totalEscrow = baseLabor + dispatchFee

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Book Service (Step $step of 4)") },
                navigationIcon = {
                    IconButton(onClick = {
                        if (step > 1) step-- else onBack()
                    }) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surface
                )
            )
        },
        bottomBar = {
            Surface(
                color = MaterialTheme.colorScheme.surface,
                shadowElevation = 8.dp,
                modifier = Modifier.fillMaxWidth()
            ) {
                Box(modifier = Modifier.padding(16.dp)) {
                    Button(
                        onClick = {
                            if (step < 4) step++ else onConfirmed()
                        },
                        colors = ButtonDefaults.buttonColors(
                            containerColor = MaterialTheme.colorScheme.primary
                        ),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(48.dp)
                    ) {
                        Text(
                            text = if (step == 4) {
                                if (totalEscrow > 0.0) "Authorize & Find Pro ($${String.format(java.util.Locale.US, "%.2f", totalEscrow)}) →" else "Authorize & Find Pro →"
                            } else "Continue →",
                            style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                        )
                    }
                }
            }
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
            LinearProgressIndicator(
                progress = step / 4f,
                modifier = Modifier.fillMaxWidth(),
                color = MaterialTheme.colorScheme.primary
            )

            when (step) {
                1 -> {
                    Text(
                        text = "1. Describe the Issue",
                        style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Bold),
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    OutlinedTextField(
                        value = issueDetails,
                        onValueChange = { issueDetails = it },
                        label = { Text("Problem Details") },
                        modifier = Modifier.fillMaxWidth(),
                        minLines = 3
                    )
                }
                2 -> {
                    Text(
                        text = "2. Service Address",
                        style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Bold),
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    OutlinedTextField(
                        value = serviceAddress,
                        onValueChange = { serviceAddress = it },
                        label = { Text("Address") },
                        modifier = Modifier.fillMaxWidth()
                    )
                    OutlinedTextField(
                        value = accessNotes,
                        onValueChange = { accessNotes = it },
                        label = { Text("Access Notes (Optional)") },
                        modifier = Modifier.fillMaxWidth()
                    )
                }
                3 -> {
                    Text(
                        text = "3. Preferred Time Slot",
                        style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Bold),
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    Surface(
                        color = MaterialTheme.colorScheme.primary.copy(alpha = 0.1f),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(
                            modifier = Modifier.padding(16.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(Icons.Default.CheckCircle, contentDescription = null, tint = MaterialTheme.colorScheme.primary)
                            Spacer(modifier = Modifier.width(10.dp))
                            Text(
                                text = "Emergency Dispatch: Within 60 Minutes",
                                style = MaterialTheme.typography.bodyLarge.copy(fontWeight = FontWeight.Bold),
                                color = MaterialTheme.colorScheme.primary
                            )
                        }
                    }
                }
                4 -> {
                    Text(
                        text = "4. Escrow Payment Hold",
                        style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Bold),
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    Surface(
                        color = MaterialTheme.colorScheme.surface,
                        shape = RoundedCornerShape(12.dp),
                        shadowElevation = 1.dp,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Text("Base Labor: $${String.format(java.util.Locale.US, "%.2f", baseLabor)}")
                            Text("Diagnostic Dispatch: $${String.format(java.util.Locale.US, "%.2f", dispatchFee)}")
                            Divider(modifier = Modifier.padding(vertical = 8.dp))
                            Text("Total Escrow Authorization: $${String.format(java.util.Locale.US, "%.2f", totalEscrow)}", fontWeight = FontWeight.Bold)
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(
                                "Funds held securely in escrow. Released only upon your signature sign-off.",
                                fontSize = 11.sp,
                                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                            )
                        }
                    }
                }
            }
        }
    }
}
