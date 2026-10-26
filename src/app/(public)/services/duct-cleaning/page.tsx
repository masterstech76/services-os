import * as React from "react";
import { businessConfig } from "@config/business.config";
import { ServiceDetailClient } from "@/components/services/ServiceDetailClient";
import { SERVICES_DETAIL_DATA } from "@/lib/services-detail-data";

export const metadata = {
  title: `Whole-Home Air Duct Cleaning & HEPA Sanitization | ${businessConfig.businessName}`,
  description: `Negative-air HEPA vacuum duct cleaning, rotobrush scrubbing, and botanical antimicrobial fogging across ${businessConfig.city}. 100% dust & odor guarantee.`,
};

export default function DuctCleaningServicePage() {
  const serviceData = SERVICES_DETAIL_DATA["duct-cleaning"];

  return (
    <ServiceDetailClient
      initialService={serviceData}
      businessPhone={businessConfig.phone}
    />
  );
}
