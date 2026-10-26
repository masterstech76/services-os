import * as React from "react";
import { businessConfig } from "@config/business.config";
import { ServiceDetailClient } from "@/components/services/ServiceDetailClient";
import { SERVICES_DETAIL_DATA } from "@/lib/services-detail-data";

export const metadata = {
  title: `AC Diagnostic & Precision Repair Within 60 Mins | ${businessConfig.businessName}`,
  description: `Emergency AC diagnostic and repair across ${businessConfig.city}. Upfront flat-rate pricing, 1-year warranty, rolling inventory vans, and certified technicians.`,
};

export default function AcRepairServicePage() {
  const serviceData = SERVICES_DETAIL_DATA["ac-repair"];

  return (
    <ServiceDetailClient
      initialService={serviceData}
      businessPhone={businessConfig.phone}
    />
  );
}
