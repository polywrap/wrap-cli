import { Libp2pCryptoIdentity } from "@textile/threads-core";
import { print } from "gluegun";

const requireKeytar = () => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports, import/no-extraneous-dependencies
    return require("keytar");
  } catch (e) {
    throw new Error(
      `
Cannot store the access token because dependencies are missing. If you
are on Linux, try installing 'libsecret-1-dev' (Debian, Ubuntu etc.) or
'libsecret-devel' (RedHat, Fedora etc.) and reinstalling W3 CLI
afterwards.
The original error was: ${e.message}
      `
    );
  }
};

export const identifyAccessToken = async (protocolName: string): Promise<Libp2pCryptoIdentity | undefined> => {
  try {
    const keytar = requireKeytar();
    const token = await keytar.getPassword("web3api-auth", protocolName);
    if (!token) {
      print.error(
        `Token not found.
Please make sure you are authenticated. Run w3 auth --help for more information`
      );
      return;
    }
    const identityToken = Libp2pCryptoIdentity.fromString(token);
    return identityToken;
  } catch (e) {
    switch (process.platform) {
      case "win32":
        print.warning(`Could not get access token from Windows Credential Vault: ${e.message}`);
        break;
      case "darwin":
        print.warning(`Could not get access token from macOS Keychain: ${e.message}`);
        break;
      case "linux":
        print.warning(
          `Could not get access token from libsecret (usually gnome-keyring or ksecretservice): ${e.message}`
        );
        break;
      default:
        print.warning(`Could not get access token from OS secret storage service: ${e.message}`);
        break;
    }
    return;
  }
};

export const saveAccessToken = async (protocolName?: string): Promise<void> => {
  try {
    const keytar = requireKeytar();
    const identity = await Libp2pCryptoIdentity.fromRandom();
    const accessToken = identity.toString();
    await keytar.setPassword("web3api-auth", protocolName, accessToken);
  } catch (e) {
    switch (process.platform) {
      case "win32":
        throw new Error(`Error storing access token in Windows Credential Vault: ${e.message}`);
      case "darwin":
        throw new Error(`Error storing access token in macOS Keychain: ${e.message}`);
      case "linux":
        throw new Error(
          `Error storing access token with libsecret (usually gnome-keyring or ksecretservice): ${e.message}`
        );
      default:
        throw new Error(`Error storing access token in OS secret storage service: ${e.message}`);
    }
  }
};
