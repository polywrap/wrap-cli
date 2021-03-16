// Workaround for https://github.com/infinitered/gluegun/pull/464.
import { getIntl } from "../internationalization";

export const fixParameters = (
  parameters: { options: Record<string, unknown>; array?: string[] },
  booleanOptions: Record<string, unknown>
): string[] => {
  const unexpectedStringOptions = Object.keys(booleanOptions)
    .filter((key) => typeof booleanOptions[key] === "string")
    .map((key) => ({ key, value: booleanOptions[key] })) as {
    key: string;
    value: string;
  }[];

  const optionNames = unexpectedStringOptions
    .map(({ key }) => `--` + key.replace(/([A-Z])/, "-$1").toLowerCase())
    .join(", ");

  if (unexpectedStringOptions.length > 1) {
    const intl = getIntl();
    const unexpectedValueMessage = intl.formatMessage(
      {
        id: "lib_helpers_parameters_unexpectedValue",
        defaultMessage:
          "Unexpected value provided for one or more of {options}. See --help for more information.",
        description: "",
      },
      { options: `${optionNames}` }
    );
    throw new Error(unexpectedValueMessage);
  } else if (unexpectedStringOptions.length == 1) {
    const params = parameters.array || [];
    params.unshift(unexpectedStringOptions[0].value);
    return params;
  } else {
    return parameters.array || [];
  }
};
