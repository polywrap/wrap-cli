export const latestMigration = {}

export const migrators = {
  "0.0.1-alpha.1": {
    upgrades: {
      "0.0.1-alpha.2": require("./migrators/0_0_1-alpha.1-0_0_1-alpha.2"),
    }
  }
}