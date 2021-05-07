import {
  BasicTracerProvider,
  ConsoleSpanExporter,
  SimpleSpanProcessor,
  Tracer as otTracer,
} from "@opentelemetry/tracing";
import { ZipkinExporter } from "@opentelemetry/exporter-zipkin";
import { WebTracerProvider } from "@opentelemetry/web";
import * as api from "@opentelemetry/api";
import { v4 as uuid } from "uuid";

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
    this._initProvider();

    if (this._provider) {
      this._tracer = this._provider.getTracer(
        `${tracerName} ${uuid().substr(0, 8)}`
      );
    }
  }

  static disableTracing(): void {
    this.traceEnabled = false;
  }

  static startSpan(spanName: string): void {
    if (!this.traceEnabled) return;

    const currentSpan = this._currentSpan();
    const span = this._tracer.startSpan(
      spanName,
      {},
      currentSpan
        ? api.setSpanContext(api.context.active(), currentSpan.context())
        : undefined
    );
    this._pushSpan(span);
  }

  static endSpan(): void {
    if (!this.traceEnabled) return;

    const span = this._currentSpan();
    if (span) {
      span.end();
      this._popSpan();
    }
  }

  static setAttribute(attrName: string, data: unknown): void {
    if (!this.traceEnabled) return;

    const span = this._currentSpan();
    if (span) {
      span.setAttribute(attrName, JSON.stringify(data));
    }
  }

  static addEvent(event: string, data?: unknown): void {
    if (!this.traceEnabled) return;

    const span = this._currentSpan();

    if (span) {
      span.addEvent(event, { data: JSON.stringify(data) });
    }
  }

  static recordException(error: api.Exception): void {
    if (!this.traceEnabled) return;

    const span = this._currentSpan();

    if (span) {
      // recordException converts the error into a span event.
      span.recordException(error);

      // If the exception means the operation results in an
      // error state, you can also use it to update the span status.
      span.setStatus({ code: api.SpanStatusCode.ERROR });
    }
  }

  static traceFunc<TArgs extends Array<any>, TReturn>(
    span: string,
    func: (...args: TArgs) => TReturn
  ) {
    return (...args: TArgs): TReturn => {
      try {
        this.startSpan(span);
        this.setAttribute("input", { ...args })
  
        const result = func(...args)
  
        this.setAttribute("output", result);
        return result;
      } catch (error) {
        this.recordException(error);
        throw error;
      } finally {
        this.endSpan();
      }
    }
  }

  // TODO: configure output types (console, file, server, etc)

  static _initProvider(): void {
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

  static _pushSpan(span: api.Span): void {
    this._spans.push(span);
  }

  static _currentSpan(): api.Span | undefined {
    return this._spans.slice(-1)[0];
  }

  static _popSpan(): void {
    this._spans.pop();
  }
}
