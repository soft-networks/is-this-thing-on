import opentelemetry, { Tracer } from "@opentelemetry/api";

const istoTracer = opentelemetry.trace.getTracer("is-this-thing-on");

export const trace = (spanName: string, fn: any) => {
  istoTracer.startActiveSpan(spanName, async (span) => {
    await fn();
    span.end();
  });
};
