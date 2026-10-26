import * as React from "react";
import { businessConfig } from "@config/business.config";
import { ServiceDetailClient } from "@/components/services/ServiceDetailClient";
import { SERVICES_DETAIL_DATA } from "@/lib/services-detail-data";

export const metadata = {
  title: `Commercial Rooftop RTU & Facility Maintenance | ${businessConfig.businessName}`,
  description: `Commercial HVAC preventative maintenance agreements, packaged RTU service, chillers, and ventilation management for commercial properties in ${businessConfig.city}.`,
};

export default function CommercialHvacServicePage() {
  const serviceData = SERVICES_DETAIL_DATA["commercial-hvac"];

  return (
    <ServiceDetailClient
      initialService={serviceData}
      businessPhone={businessConfig.phone}
    />
  );
}
