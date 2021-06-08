import fs from "fs";

export const getEnvVariables = async (
  modulesPaths: string[]
): Promise<string[]> => {
  //Matches ${...} syntax
  const envVarRegex = /\${([^}]+)}/gm;

  const vars = modulesPaths.reduce((acc, current) => {
    const rawManifest = fs.readFileSync(current, "utf-8");
    const matches = rawManifest.match(envVarRegex) || [];

    return [
      ...acc,
      ...matches.map((match) => {
        if (match.startsWith("$")) {
          if (match.startsWith("${")) {
            return match.slice(2, match.length - 1);
          }

          return match.slice(1);
        }

        return match;
      }),
    ];
  }, [] as string[]);

  return Array.from(new Set(vars));
};
