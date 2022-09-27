import { Migration } from "../../migrations";
import { migrate as migrate_0_1_0_to_0_2_0 } from "./migrators/0.1.0_to_0.2.0";

export const migrations: Migration[] = [
  {
    from: "0.1",
    to: "0.2.0",
    migrateFn: migrate_0_1_0_to_0_2_0
  },
  {
    from: "0.1.0",
    to: "0.2.0",
    migrateFn: migrate_0_1_0_to_0_2_0
  }
];