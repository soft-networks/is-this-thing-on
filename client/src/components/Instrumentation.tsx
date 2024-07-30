"use client";

import { HoneycombWebSDK } from "@honeycombio/opentelemetry-web";
import { getWebAutoInstrumentations } from "@opentelemetry/auto-instrumentations-web";

const configDefaults = {
  ignoreNetworkEvents: true,
};

export default function Instrumentation() {
  try {
    const sdk = new HoneycombWebSDK({
      debug: false,
      apiKey: process.env.NEXT_PUBLIC_HONEYCOMB_INGEST_API_KEY,
      serviceName: process.env.NEXT_PUBLIC_HONEYCOMB_SERVICE_NAME,
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
