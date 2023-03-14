import { WrapError } from "../WrapError";

import { Result } from "@polywrap/result";

/**
 * Result of an Wrapper invocation.
 *
 * @template TData Type of the invoke result data.
 */
export type InvokeResult<TData = unknown> = Result<TData, WrapError>;
