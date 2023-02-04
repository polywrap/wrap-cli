type Arch =
  | "unknown"
  | "arm64"
  | "x64";

export function getArch(): Arch {
  // Possible values are:
  // 'arm', 'arm64', 'ia32',
  // 'mips','mipsel', 'ppc',
  // 'ppc64', 's390', 's390x', and
  // 'x64'.
  const arch = process.arch;

  if (arch.indexOf("arm") === 0) {
    return "arm64";
  }

  if (arch === "x64") {
    return "x64";
  }

  return "unknown";
}
