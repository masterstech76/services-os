package com.serviceos.app.ui.customer

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.FilterList
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.serviceos.app.data.model.ServiceItem
import com.serviceos.app.data.repository.ServiceRepository
import com.serviceos.app.ui.components.CategoryRow
import com.serviceos.app.ui.components.ServiceCard

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CategoryFeedScreen(
    categoryName: String = "Plumbing Services",
    onBack: () -> Unit = {},
    onServiceClick: (ServiceItem) -> Unit = {}
) {
    var selectedId by remember { mutableStateOf<String?>("plumb") }
    val categories = remember { ServiceRepository.categories }
    val services = remember { ServiceRepository.featuredServices }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = categoryName,
                        style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Bold)
                    )
                },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                },
                actions = {
                    IconButton(onClick = {}) {
                        Icon(Icons.Default.FilterList, contentDescription = "Filter")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surface
                )
            )
        },
        containerColor = MaterialTheme.colorScheme.background
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            item {
                Spacer(modifier = Modifier.height(6.dp))
                CategoryRow(
                    categories = categories,
                    selectedCategoryId = selectedId,
                    onCategorySelected = { selectedId = it.id }
                )
            }

            items(services) { service ->
                Box(modifier = Modifier.padding(horizontal = 16.dp)) {
                    ServiceCard(
                        service = service,
                        onBookClick = { onServiceClick(service) },
                        onClick = { onServiceClick(service) }
                    )
                }
            }

            item {
                Spacer(modifier = Modifier.height(24.dp))
            }
        }
    }
}
