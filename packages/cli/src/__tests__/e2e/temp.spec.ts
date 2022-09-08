import { runSchemaCommand } from "../../commands";

describe("temp", () => {
  test("temp", async () => {
    runSchemaCommand({ raw: false });
    expect(true).toBeTruthy();
  });
});
