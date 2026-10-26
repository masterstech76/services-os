import * as React from "react";
import { businessConfig } from "@config/business.config";
import { ServiceDetailClient } from "@/components/services/ServiceDetailClient";
import { SERVICES_DETAIL_DATA } from "@/lib/services-detail-data";

export const metadata = {
  title: `21-Point AC Maintenance & Tune-Up Special | ${businessConfig.businessName}`,
  description: `Keep your AC running at peak efficiency with our $89 21-point seasonal maintenance special across ${businessConfig.city}. 100% breakdown-free guarantee.`,
};

export default function AcTuneupServicePage() {
  const serviceData = SERVICES_DETAIL_DATA["ac-tuneup"];

  return (
    <ServiceDetailClient
      initialService={serviceData}
      businessPhone={businessConfig.phone}
    />
  );
}
