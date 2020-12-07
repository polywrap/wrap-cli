import {print} from 'gluegun';

type SpinnerResult<TResult> = {
  warning?: string;
  result: TResult;
};

export type SpinnerFunction<TResult> = (
  spinner: ReturnType<typeof print['spin']>
) => Promise<SpinnerResult<TResult> | TResult>;

// Executes the function `f` in a command-line spinner, using the
// provided captions for in-progress, error and failed messages.
//
// If `f` throws an error, the spinner stops with the failure message
//   and rethrows the error.
// If `f` returns an object with a `warning` and a `result` key, the
//   spinner stops with the warning message and returns the `result` value.
// Otherwise the spinner prints the in-progress message with a check mark
//   and simply returns the value returned by `f`.
export const withSpinner = async <TResult>(
  text: string,
  errorText: string,
  warningText: string,
  execute: SpinnerFunction<TResult>
): Promise<TResult> => {
  const spinner = print.spin(text);
  try {
    const result = await execute(spinner);
    if (typeof result === 'object') {
      const hasWarning = Object.keys(result).indexOf('warning') >= 0;
      const hasResult = Object.keys(result).indexOf('result') >= 0;
      if (hasWarning && hasResult) {
        const spinnerResult: SpinnerResult<TResult> = result as SpinnerResult<TResult>;
        if (spinnerResult.warning !== null) {
          spinner.warn(`${warningText}: ${spinnerResult.warning}`);
        }
        spinner.succeed(text);
        return spinnerResult.result;
      } else {
        spinner.succeed(text);
        return result as TResult;
      }
    } else {
      spinner.succeed(text);
      return result;
    }
  } catch (e) {
    spinner.fail(`${errorText}: ${e.message}`);
    throw e;
  }
};

export const step = (
  spinner: ReturnType<typeof print['spin']>,
  subject: string,
  text: string
): ReturnType<typeof print['spin']> => {
  if (text) {
    spinner.stopAndPersist({
      text: print.colors.muted(`${subject} ${text}`),
    });
  } else {
    spinner.stopAndPersist({text: print.colors.muted(subject)});
  }
  spinner.start();
  return spinner;
};
