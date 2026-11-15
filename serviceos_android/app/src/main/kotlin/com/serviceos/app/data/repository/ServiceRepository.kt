package com.serviceos.app.data.repository

import com.serviceos.app.data.model.ServiceCategory
import com.serviceos.app.data.model.ServiceItem
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

object ServiceRepository {
    private val _categories = MutableStateFlow<List<ServiceCategory>>(emptyList())
    val categoriesFlow: StateFlow<List<ServiceCategory>> = _categories.asStateFlow()

    private val _featuredServices = MutableStateFlow<List<ServiceItem>>(emptyList())
    val featuredServicesFlow: StateFlow<List<ServiceItem>> = _featuredServices.asStateFlow()

    val categories: List<ServiceCategory>
        get() = _categories.value

    val featuredServices: List<ServiceItem>
        get() = _featuredServices.value

    fun setCatalogue(categories: List<ServiceCategory>, services: List<ServiceItem>) {
        _categories.value = categories
        _featuredServices.value = services
    }
}
