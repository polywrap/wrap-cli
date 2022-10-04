import { Migrator } from "../../../migrations";
import { migrate as migrate_0_1_0_to_0_1_0 } from "./0.1.0_to_0.1.0";

export const migrators: Migrator[] = [
  {
    from: "0.1.0",
    to: "0.1.0",
    migrate: migrate_0_1_0_to_0_1_0,
  },
];
