"use client";

import { HoneycombWebSDK } from "@honeycombio/opentelemetry-web";
import { getWebAutoInstrumentations } from "@opentelemetry/auto-instrumentations-web";

const configDefaults = {
  ignoreNetworkEvents: true,
  // propagateTraceHeaderCorsUrls: [
  // /.+/g, // Regex to match your backend URLs. Update to the domains you wish to include.
  // ]
};

export default function Observability() {
  try {
    const sdk = new HoneycombWebSDK({
      // endpoint: "https://api.eu1.honeycomb.io/v1/traces", // Send to EU instance of Honeycomb. Defaults to sending to US instance.
      debug: true, // Set to false for production environment.
      apiKey: process.env.NEXT_PUBLIC_HONEYCOMB_INGEST_API_KEY, // Replace with your Honeycomb Ingest API Key.
      serviceName: process.env.NEXT_PUBLIC_HONEYCOMB_SERVICE_NAME, // Replace with your application name. Honeycomb uses this string to find your dataset when we receive your data. When no matching dataset exists, we create a new one with this name if your API Key has the appropriate permissions.
      instrumentations: [
        getWebAutoInstrumentations({
          // Disable these for now since they generate a lot of events and have questionable utility.
          "@opentelemetry/instrumentation-xml-http-request": { enabled: false },
          "@opentelemetry/instrumentation-fetch": { enabled: false },
          "@opentelemetry/instrumentation-document-load": configDefaults,
        }),
      ],
    });

    sdk.start();
  } catch (e) {
    return null;
  }

  return null;
}
