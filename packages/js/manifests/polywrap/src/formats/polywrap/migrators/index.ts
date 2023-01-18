import { Migrator } from "../../../migrations";
import { migrate as migrate_0_1_0_to_0_2_0 } from "./0.1.0_to_0.2.0";
import { migrate as migrate_0_2_0_to_0_3_0 } from "./0.2.0_to_0.3.0";

export const migrators: Migrator[] = [
  {
    from: "0.1",
    to: "0.2.0",
    migrate: migrate_0_1_0_to_0_2_0,
  },
  {
    from: "0.1.0",
    to: "0.2.0",
    migrate: migrate_0_1_0_to_0_2_0,
  },
  {
    from: "0.2.0",
    to: "0.3.0",
    migrate: migrate_0_2_0_to_0_3_0,
  }
];
