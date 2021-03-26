import {
  BasicTracerProvider,
  ConsoleSpanExporter,
  SimpleSpanProcessor,
} from "@opentelemetry/tracing";
import { WebTracerProvider } from "@opentelemetry/web";
import * as api from "@opentelemetry/api";
import { ZoneContextManager } from "@opentelemetry/context-zone";
import { B3Propagator } from "@opentelemetry/propagator-b3";

export class Tracer {
  public static traceEnabled = false;

  private static _tracer: api.Tracer;
  private static _provider:
    | WebTracerProvider
    | BasicTracerProvider
    | null = null;

  static enableTracing(tracerName: string): void {
    this.traceEnabled = true;
    this.initProvider();

    this._tracer = api.trace.getTracer(tracerName);
  }

  static disableTracing(): void {
    this.traceEnabled = false;
  }

  static startSpan(spanName: string): void {
    if (!this.traceEnabled) return;

    this._tracer.startSpan(spanName);
  }

  static setAttribute(attrName: string, data: unknown): void {
    if (!this.traceEnabled) return;

    const span = api.getSpan(api.context.active());
    if (span) {
      span.setAttribute(attrName, JSON.stringify(data));
    }
  }

  static addEvent(event: string, data?: unknown): void {
    if (!this.traceEnabled) return;

    const span = api.getSpan(api.context.active());

    if (span) {
      span.addEvent(event, { data: JSON.stringify(data) });
    }
  }

  static recordException(error: api.Exception): void {
    if (!this.traceEnabled) return;

    const span = api.getSpan(api.context.active());

    if (span) {
      // recordException converts the error into a span event.
      span.recordException(error);

      // If the exception means the operation results in an
      // error state, you can also use it to update the span status.
      span.setStatus({ code: api.SpanStatusCode.ERROR });
    }
  }

  static endSpan(): void {
    if (!this.traceEnabled) return;

    const span = api.getSpan(api.context.active());
    if (span) span.end();
  }

  static initProvider(): void {
    if (this._provider) return;

    if (typeof window === "undefined") {
      this._provider = new BasicTracerProvider();
    } else {
      this._provider = new WebTracerProvider();
    }

    // Configure span processor to send spans to the exporter
    this._provider.addSpanProcessor(
      new SimpleSpanProcessor(new ConsoleSpanExporter())
    );

    this._provider.register({
      contextManager: new ZoneContextManager(),
      propagator: new B3Propagator(),
    });
  }
}
