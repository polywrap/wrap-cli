import {
  BasicTracerProvider,
  ConsoleSpanExporter,
  SimpleSpanProcessor,
} from "@opentelemetry/tracing";
import * as api from "@opentelemetry/api";

export class Tracer {
  public static traceEnabled = false;

  private static _tracer: api.Tracer;
  private static _provider: BasicTracerProvider | null = null;

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

    this._provider = new BasicTracerProvider();

    // Configure span processor to send spans to the exporter
    this._provider.addSpanProcessor(
      new SimpleSpanProcessor(new ConsoleSpanExporter())
    );

    this._provider.register();
  }
}
