import * as React from "react";
import { businessConfig } from "@config/business.config";
import { ServiceDetailClient } from "@/components/services/ServiceDetailClient";
import { SERVICES_DETAIL_DATA } from "@/lib/services-detail-data";

export const metadata = {
  title: `24/7 Emergency HVAC Repair in 60 Minutes | ${businessConfig.businessName}`,
  description: `24/7 priority emergency AC & heating repair in ${businessConfig.city}. 60-minute rapid arrival, fully stocked mobile vans, zero overtime charges.`,
};

export default function EmergencyHvacPage() {
  const serviceData = SERVICES_DETAIL_DATA["emergency-hvac"];

  return (
    <ServiceDetailClient
      initialService={serviceData}
      businessPhone={businessConfig.phone}
    />
  );
}
