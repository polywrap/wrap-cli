import {
  BasicTracerProvider,
  ConsoleSpanExporter,
  SimpleSpanProcessor,
  Tracer as otTracer,
} from "@opentelemetry/tracing";
import { ZipkinExporter } from "@opentelemetry/exporter-zipkin";
import { WebTracerProvider } from "@opentelemetry/web";
import * as api from "@opentelemetry/api";

export class Tracer {
  public static traceEnabled = false;

  private static _tracer: otTracer;
  private static _provider:
    | WebTracerProvider
    | BasicTracerProvider
    | null = null;
  private static _spans: Array<api.Span> = [];

  static enableTracing(tracerName: string): void {
    this.traceEnabled = true;
    this.initProvider();

    if (this._provider) {
      this._tracer = this._provider.getTracer(tracerName);
    }
  }

  static disableTracing(): void {
    this.traceEnabled = false;
  }

  static pushSpan(span: api.Span): void {
    this._spans.push(span);
  }

  static currentSpan(): api.Span | undefined {
    return this._spans.slice(-1)[0];
  }

  static popSpan(): void {
    this._spans.pop();
  }

  static startSpan(spanName: string): void {
    if (!this.traceEnabled) return;

    const currentSpan = this.currentSpan();
    const span = this._tracer.startSpan(
      spanName,
      {},
      currentSpan
        ? api.setSpanContext(api.context.active(), currentSpan.context())
        : undefined
    );
    this.pushSpan(span);
  }

  static setAttribute(attrName: string, data: unknown): void {
    if (!this.traceEnabled) return;

    const span = this.currentSpan();
    if (span) {
      span.setAttribute(attrName, JSON.stringify(data));
    }
  }

  static addEvent(event: string, data?: unknown): void {
    if (!this.traceEnabled) return;

    const span = this.currentSpan();

    if (span) {
      span.addEvent(event, { data: JSON.stringify(data) });
    }
  }

  static recordException(error: api.Exception): void {
    if (!this.traceEnabled) return;

    const span = this.currentSpan();

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

    const span = this.currentSpan();
    if (span) {
      span.end();
      this.popSpan();
    }
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

    this._provider.addSpanProcessor(
      new SimpleSpanProcessor(new ZipkinExporter())
    );

    this._provider.register();
  }
}
