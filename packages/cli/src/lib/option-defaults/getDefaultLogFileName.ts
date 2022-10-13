export function getDefaultLogFileName(): string {
  const now = new Date();
  return `polywrap-${now.getTime()}.log`;
}