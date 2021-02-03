/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/no-var-requires,@typescript-eslint/no-require-imports
const toolbox = require("gluegun/toolbox");

// Executes the function `f` in a command-line spinner, using the
// provided captions for in-progress, error and failed messages.
//
// If `f` throws an error, the spinner stops with the failure message
//   and rethrows the error.
// If `f` returns an object with a `warning` and a `result` key, the
//   spinner stops with the warning message and returns the `result` value.
// Otherwise the spinner prints the in-progress message with a check mark
//   and simply returns the value returned by `f`.
export const withSpinner = async (
  text: string,
  errorText: string,
  warningText: string,
  execute: (spinner: any) => Promise<any>
): Promise<any> => {
  const spinner = toolbox.print.spin(text);
  try {
    const result = await execute(spinner);
    if (typeof result === "object") {
      const hasWarning = Object.keys(result).indexOf("warning") >= 0;
      const hasResult = Object.keys(result).indexOf("result") >= 0;
      if (hasWarning && hasResult) {
        if (result.warning !== null) {
          spinner.warn(`${warningText}: ${result.warning}`);
        }
        spinner.succeed(text);
        return result.result;
      } else {
        spinner.succeed(text);
        return result;
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

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const step = (spinner: any, subject: string, text?: string): any => {
  if (text) {
    spinner.stopAndPersist({
      text: toolbox.print.colors.muted(`${subject} ${text}`),
    });
  } else {
    spinner.stopAndPersist({ text: toolbox.print.colors.muted(subject) });
  }
  spinner.start();
  return spinner;
};
