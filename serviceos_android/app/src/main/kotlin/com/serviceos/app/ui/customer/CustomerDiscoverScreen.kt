package com.serviceos.app.ui.customer

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.serviceos.app.data.model.ServiceCategory
import com.serviceos.app.data.model.ServiceItem
import com.serviceos.app.data.repository.ServiceRepository
import com.serviceos.app.ui.components.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CustomerDiscoverScreen(
    onThemeToggle: () -> Unit = {},
    onSearchClick: () -> Unit = {},
    onCategoryClick: (ServiceCategory) -> Unit = {},
    onServiceClick: (ServiceItem) -> Unit = {},
    onBookService: (ServiceItem) -> Unit = {}
) {
    var selectedCategoryId by remember { mutableStateOf<String?>("plumb") }
    val categories = remember { ServiceRepository.categories }
    val featuredServices = remember { ServiceRepository.featuredServices }

    Scaffold(
        topBar = {
            AppHeader(
                locationTitle = "Select Service Location",
                onThemeToggle = onThemeToggle
            )
        },
        containerColor = MaterialTheme.colorScheme.background
    ) { paddingValues ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // 1. Hero Banner
            item {
                HeroBanner(onSearchClick = onSearchClick)
            }

            // 2. Trust Strip
            item {
                TrustStrip()
            }

            // 3. 17 Categories Horizontal Scroll
            item {
                Column {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 16.dp),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(
                            text = "Browse Categories",
                            style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.ExtraBold),
                            color = MaterialTheme.colorScheme.onSurface
                        )
                        Text(
                            text = "See All 17 →",
                            style = MaterialTheme.typography.bodyMedium.copy(
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.primary
                            )
                        )
                    }
                    Spacer(modifier = Modifier.height(10.dp))
                    CategoryRow(
                        categories = categories,
                        selectedCategoryId = selectedCategoryId,
                        onCategorySelected = { cat ->
                            selectedCategoryId = cat.id
                            onCategoryClick(cat)
                        }
                    )
                }
            }

            // 4. Featured Services Grid
            item {
                Text(
                    text = "Most Requested Near You",
                    style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.ExtraBold),
                    color = MaterialTheme.colorScheme.onSurface,
                    modifier = Modifier.padding(horizontal = 16.dp)
                )
            }

            items(featuredServices) { service ->
                Box(modifier = Modifier.padding(horizontal = 16.dp)) {
                    ServiceCard(
                        service = service,
                        onBookClick = { onBookService(service) },
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
