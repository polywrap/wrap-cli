import axios from "axios";

export async function awaitResponse(
  url: string,
  timeout = 2000,
  maxTimeout = 20000
): Promise<boolean> {
  let time = 0;

  while (time < maxTimeout) {
    const request = axios.get(url, { timeout });
    const success = await request
      .then(() => true)
      .catch((e) => e.code !== "ECONNRESET");

    if (success) {
      return true;
    }

    await new Promise<void>(function (resolve) {
      setTimeout(() => resolve(), timeout);
    });

    time += timeout;
  }

  return false;
}
