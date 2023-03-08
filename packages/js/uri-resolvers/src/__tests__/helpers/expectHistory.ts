import { buildCleanUriHistory, IUriResolutionStep } from "@polywrap/core-js";
import fs from "fs";

export const expectHistory = async (
  receivedHistory: IUriResolutionStep<unknown>[] | undefined,
  historyFileName: string
): Promise<void> => {
  if (!receivedHistory) {
    fail("History is not defined");
  }

  const expectedCleanHistoryStr = await fs.promises.readFile(
    `${__dirname}/../histories/${historyFileName}.json`,
    "utf-8"
  );
  const expectedCleanHistory = JSON.stringify(JSON.parse(expectedCleanHistoryStr), null, 2);

  const receivedCleanHistory = JSON.stringify(buildCleanUriHistory(receivedHistory), null, 2);

  expect(receivedCleanHistory).toEqual(expectedCleanHistory);
};