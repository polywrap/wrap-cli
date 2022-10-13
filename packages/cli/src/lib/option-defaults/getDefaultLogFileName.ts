export function getDefaultLogFileName(): string {
  return `./.polywrap/logs/polywrap-${Date.now().toString()}.log`;
}