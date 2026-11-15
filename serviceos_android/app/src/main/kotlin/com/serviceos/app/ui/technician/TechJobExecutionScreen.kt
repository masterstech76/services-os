package com.serviceos.app.ui.technician

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.serviceos.app.core.theme.LocalExtraColors

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TechJobExecutionScreen(
    accessNotes: String = "",
    onJobCompleted: () -> Unit = {},
    onOpenChat: () -> Unit = {}
) {
    var stage by remember { mutableStateOf(1) } // 1: Navigation, 2: Arrival & Before Photos, 3: Active Work, 4: Sign-off & Payout
    val extraColors = LocalExtraColors.current

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = "Work Order #SVC-2026-1001",
                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                    )
                },
                actions = {
                    IconButton(onClick = onOpenChat) {
                        Icon(Icons.Default.Chat, contentDescription = "Chat Customer")
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
                            if (stage < 4) stage++ else onJobCompleted()
                        },
                        colors = ButtonDefaults.buttonColors(
                            containerColor = if (stage == 4) extraColors.verified else MaterialTheme.colorScheme.primary,
                            contentColor = Color.White
                        ),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(52.dp)
                    ) {
                        Text(
                            text = when (stage) {
                                1 -> "Confirm Geofence Arrival →"
                                2 -> "Submit Before Photos & Start Timer →"
                                3 -> "Finish Work & Present Signature Pad →"
                                else -> "Complete Work Order & Deposit $159.38 →"
                            },
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
            // Stage Status Bar
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = "STEP $stage OF 4: ${
                        when (stage) {
                            1 -> "EN ROUTE NAVIGATION"
                            2 -> "ARRIVAL & MANDATORY PROOF"
                            3 -> "ACTIVE WORK TIMER & SCOPE"
                            else -> "CUSTOMER SIGNATURE & PAYOUT"
                        }
                    }",
                    style = MaterialTheme.typography.labelSmall.copy(
                        fontWeight = FontWeight.ExtraBold,
                        color = MaterialTheme.colorScheme.primary,
                        letterSpacing = 0.8.sp
                    )
                )
            }
            LinearProgressIndicator(
                progress = stage / 4f,
                color = MaterialTheme.colorScheme.primary,
                modifier = Modifier.fillMaxWidth()
            )

            when (stage) {
                1 -> {
                    // Turn-By-Turn Navigation Bar
                    Surface(
                        color = MaterialTheme.colorScheme.surface,
                        shape = RoundedCornerShape(16.dp),
                        shadowElevation = 2.dp,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.padding(18.dp)) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(
                                    imageVector = Icons.Default.Navigation,
                                    contentDescription = null,
                                    tint = MaterialTheme.colorScheme.primary,
                                    modifier = Modifier.size(28.dp)
                                )
                                Spacer(modifier = Modifier.width(12.dp))
                                Column {
                                    Text(
                                        text = "En Route to Service Location",
                                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.ExtraBold)
                                    )
                                    Text(
                                        text = "GPS Turn-by-Turn Navigation Active",
                                        style = MaterialTheme.typography.bodyMedium,
                                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                                    )
                                }
                            }
                            Spacer(modifier = Modifier.height(14.dp))
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Text("ETA: 12 minutes (2.4 miles)", fontWeight = FontWeight.Bold, color = extraColors.verified)
                                if (accessNotes.isNotBlank()) {
                                    Text("Access: $accessNotes", fontWeight = FontWeight.Bold)
                                }
                            }
                        }
                    }
                }
                2 -> {
                    // Mandatory Before Photos
                    Text(
                        text = "Mandatory Pre-Service Photos (2 Required)",
                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                    )
                    Text(
                        text = "Capture clear photos of the clog/leak prior to commencing labor for warranty escrow validation.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                    )
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        Surface(
                            color = MaterialTheme.colorScheme.surface,
                            shape = RoundedCornerShape(12.dp),
                            border = androidx.compose.foundation.BorderStroke(1.dp, extraColors.verified),
                            modifier = Modifier
                                .weight(1f)
                                .height(110.dp)
                        ) {
                            Box(contentAlignment = Alignment.Center) {
                                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                    Icon(Icons.Default.CheckCircle, contentDescription = null, tint = extraColors.verified)
                                    Text("Photo 1 Attached", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                }
                            }
                        }
                        Surface(
                            color = MaterialTheme.colorScheme.surface,
                            shape = RoundedCornerShape(12.dp),
                            border = androidx.compose.foundation.BorderStroke(1.dp, extraColors.verified),
                            modifier = Modifier
                                .weight(1f)
                                .height(110.dp)
                        ) {
                            Box(contentAlignment = Alignment.Center) {
                                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                    Icon(Icons.Default.CheckCircle, contentDescription = null, tint = extraColors.verified)
                                    Text("Photo 2 Attached", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                }
                            }
                        }
                    }
                }
                3 -> {
                    // Active Billable Timer & Parts
                    Surface(
                        color = MaterialTheme.colorScheme.surface,
                        shape = RoundedCornerShape(16.dp),
                        shadowElevation = 2.dp,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(
                            modifier = Modifier.padding(20.dp),
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Text("ACTIVE WORK ORDER TIMER", fontSize = 11.sp, fontWeight = FontWeight.Bold, letterSpacing = 1.sp)
                            Spacer(modifier = Modifier.height(4.dp))
                            Text("00:42:18", style = MaterialTheme.typography.headlineLarge.copy(fontWeight = FontWeight.Black, fontSize = 42.sp))
                            Text("Standard Billable Rate: $95 / hr", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f))
                        }
                    }

                    // Add Extra Parts Form
                    Surface(
                        color = MaterialTheme.colorScheme.surface,
                        shape = RoundedCornerShape(16.dp),
                        shadowElevation = 1.dp,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Text("Authorized Replacement Parts", fontWeight = FontWeight.Bold)
                            Spacer(modifier = Modifier.height(6.dp))
                            Text("1x Heavy-Duty Brass P-Trap 1-1/2\" — $24.50 (Approved by Customer)", fontSize = 12.sp)
                            Text("1x High-Pressure Silicone Seal Kit — $14.00 (Approved by Customer)", fontSize = 12.sp)
                            Spacer(modifier = Modifier.height(8.dp))
                            Text("Extra Parts Total: $38.50", fontWeight = FontWeight.ExtraBold, color = MaterialTheme.colorScheme.primary)
                        }
                    }
                }
                4 -> {
                    // Payout Summary Card
                    Surface(
                        color = MaterialTheme.colorScheme.surface,
                        shape = RoundedCornerShape(18.dp),
                        shadowElevation = 2.dp,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.padding(20.dp)) {
                            Text("COMPLETION SETTLEMENT SUMMARY", fontSize = 11.sp, fontWeight = FontWeight.Bold, letterSpacing = 1.sp)
                            Spacer(modifier = Modifier.height(10.dp))
                            Text("Gross Customer Billing: $187.50")
                            Text("ServiceOS Platform Fee (15%): -$28.12")
                            Divider(modifier = Modifier.padding(vertical = 10.dp))
                            Text(
                                text = "Your Net Direct Deposit: $159.38",
                                style = MaterialTheme.typography.titleLarge.copy(
                                    fontWeight = FontWeight.Black,
                                    color = extraColors.verified
                                )
                            )
                        }
                    }

                    // Customer Signature Pad Presentation
                    Text("Customer Digital Signature Collected:", fontWeight = FontWeight.Bold)
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(110.dp)
                            .background(MaterialTheme.colorScheme.surface, RoundedCornerShape(12.dp))
                            .border(1.dp, extraColors.verified, RoundedCornerShape(12.dp)),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "Customer Signature Verified",
                            fontStyle = androidx.compose.ui.text.font.FontStyle.Italic,
                            fontWeight = FontWeight.Bold,
                            color = extraColors.verified
                        )
                    }
                }
            }
        }
    }
}
