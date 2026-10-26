import * as React from "react";
import { businessConfig } from "@config/business.config";
import { ServiceDetailClient } from "@/components/services/ServiceDetailClient";
import { SERVICES_DETAIL_DATA } from "@/lib/services-detail-data";

export const metadata = {
  title: `Smart Thermostat Installation & WiFi Calibration | ${businessConfig.businessName}`,
  description: `Professional smart thermostat installation for Nest, Ecobee, and Honeywell across ${businessConfig.city}. 24V common C-wire integration, app setup & tutorial.`,
};

export default function ThermostatInstallServicePage() {
  const serviceData = SERVICES_DETAIL_DATA["thermostat-install"];

  return (
    <ServiceDetailClient
      initialService={serviceData}
      businessPhone={businessConfig.phone}
    />
  );
}
