import * as React from "react";
import { businessConfig } from "@config/business.config";
import { ServiceDetailClient } from "@/components/services/ServiceDetailClient";
import { SERVICES_DETAIL_DATA } from "@/lib/services-detail-data";

export const metadata = {
  title: `Furnace & Heat Pump Safety Repair | ${businessConfig.businessName}`,
  description: `Emergency diagnostic and repair for heat pumps, electric air handler heat strips, sequencers, and limit switches across ${businessConfig.city}. Upfront flat pricing.`,
};

export default function FurnaceRepairServicePage() {
  const serviceData = SERVICES_DETAIL_DATA["furnace-repair"];

  return (
    <ServiceDetailClient
      initialService={serviceData}
      businessPhone={businessConfig.phone}
    />
  );
}
