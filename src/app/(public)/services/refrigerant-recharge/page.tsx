import * as React from "react";
import { businessConfig } from "@config/business.config";
import { ServiceDetailClient } from "@/components/services/ServiceDetailClient";
import { SERVICES_DETAIL_DATA } from "@/lib/services-detail-data";

export const metadata = {
  title: `Refrigerant Leak Test & Freon Recharge | ${businessConfig.businessName}`,
  description: `Electronic sniffing leak detection, nitrogen pressure tests, and EPA-certified R-410A / R-22 subcooling balancing across ${businessConfig.city}.`,
};

export default function RefrigerantRechargePage() {
  const serviceData = SERVICES_DETAIL_DATA["refrigerant-recharge"];

  return (
    <ServiceDetailClient
      initialService={serviceData}
      businessPhone={businessConfig.phone}
    />
  );
}
