import {
  BasicTracerProvider,
  SimpleSpanProcessor,
  Tracer as otTracer,
} from "@opentelemetry/tracing";
import { ZipkinExporter } from "@opentelemetry/exporter-zipkin";
import { WebTracerProvider } from "@opentelemetry/web";
import * as api from "@opentelemetry/api";
import inspect from "browser-util-inspect";

type MaybeAsync<T> = Promise<T> | T;

const isPromise = <T extends unknown>(
  test?: MaybeAsync<T>
): test is Promise<T> =>
  !!test && typeof (test as Promise<T>).then === "function";

export class Tracer {
  public static traceEnabled = false;

  private static _tracer: otTracer;
  private static _provider:
    | WebTracerProvider
    | BasicTracerProvider
    | null = null;
  private static _spans: Array<api.Span> = [];

  static enableTracing(tracerName: string, serviceName = "Polywrap"): void {
    this.traceEnabled = true;
    this._initProvider(serviceName);

    if (this._provider) {
      this._tracer = this._provider.getTracer(tracerName) as otTracer;
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
        ? api.trace.setSpanContext(
            api.context.active(),
            currentSpan.spanContext()
          )
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
      span.setAttribute(attrName, JSON.stringify(inspect(data)));
    }
  }

  static addEvent(event: string, data?: unknown): void {
    if (!this.traceEnabled) return;

    const span = this._currentSpan();

    if (span) {
      span.addEvent(event, { data: JSON.stringify(inspect(data)) });
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

  static traceMethod(span: string) {
    return function (
      target: unknown,
      key: string | symbol,
      descriptor: PropertyDescriptor
    ): PropertyDescriptor {
      const original = descriptor.value;

      descriptor.value = function <TArgs extends Array<unknown>, TReturn>(
        ...args: TArgs[]
      ): TReturn {
        try {
          Tracer.startSpan(span);
          Tracer.setAttribute("args", { ...args });

          const result = original.apply(this, args);

          if (isPromise(result)) {
            return (result.then((result) => {
              Tracer.setAttribute("output", result);
              Tracer.endSpan();
              return result;
            }) as unknown) as TReturn;
          } else {
            Tracer.setAttribute("output", result);
            Tracer.endSpan();
            return result;
          }
        } catch (error) {
          Tracer.recordException(error);
          Tracer.endSpan();
          throw error;
        }
      };

      return descriptor;
    };
  }

  static traceFunc<TArgs extends Array<unknown>, TReturn>(
    span: string,
    func: (...args: TArgs) => TReturn
  ) {
    return (...args: TArgs): TReturn => {
      try {
        this.startSpan(span);
        this.setAttribute("args", { ...args });

        const result = func(...args);

        if (isPromise(result)) {
          return (result.then((result) => {
            this.setAttribute("output", result);
            this.endSpan();
            return result;
          }) as unknown) as TReturn;
        } else {
          this.setAttribute("output", result);
          this.endSpan();
          return result;
        }
      } catch (error) {
        this.recordException(error);
        this.endSpan();
        throw error;
      }
    };
  }

  static _initProvider(serviceName: string): void {
    if (this._provider) return;

    if (typeof window === "undefined") {
      this._provider = new BasicTracerProvider();
    } else {
      this._provider = new WebTracerProvider();
    }

    // Configure span processor to send spans to the exporter
    this._provider.addSpanProcessor(
      new SimpleSpanProcessor(
        new ZipkinExporter({
          serviceName: serviceName,
        })
      )
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
