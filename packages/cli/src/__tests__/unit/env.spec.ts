import { loadEnvironmentVariables } from "../../lib";

describe("Unit tests for Project", () => {
  beforeAll(() => {
    // Setup process environment variables
    process.env = {
      ...process.env,
      DOMAIN_NAME: "test1.eth",
      STAGE_NAME: "stage",
      PACKAGE_NAME: "package",
      RANDOM_NAME: "name"
    };
  });

  test("Update object as expected if has environment variables", async () => {
    const simpleDeploySchema = {
      "ipfs_deploy": {
        package: "ipfs",
        uri: "fs/./build"
      },
      "from_deploy": {
        package: "ens",
        depends_on: "ipfs_deploy",
        config: {
          domainName: "${DOMAIN_NAME}"
        }
      }
    }
    let loadedScheme =  loadEnvironmentVariables(simpleDeploySchema)
    expect(loadedScheme).toEqual({
      ...simpleDeploySchema,
      from_deploy: {
        ...simpleDeploySchema.from_deploy,
        config: {
          domainName: "test1.eth"
        }
      }
    })

    const complexDeploySchema = {
      "ipfs_deploy": {
        package: "ipfs",
        uri: "fs/./build"
      },
      "from_deploy": {
        package: "ens",
        depends_on: "ipfs_deploy",
        config: {
          domainName: "$DOMAIN_NAME"
        }
      },
      "another_from_deploy": {
        package: "$PACKAGE_NAME",
        depends_on: ["ipfs_deploy", "from_deploy", "$STAGE_NAME"],
        config: {
          randomValues: [ { user: "$RANDOM_NAME", pass: "pass"}]
        }
      }
    }
    loadedScheme = loadEnvironmentVariables(complexDeploySchema)
    expect(loadedScheme).toEqual({
      ...complexDeploySchema,
      from_deploy: {
        ...complexDeploySchema.from_deploy,
        config: {
          domainName: "test1.eth"
        }
      },
      another_from_deploy: {
        package: "package",
        depends_on: [ "ipfs_deploy", "from_deploy", "stage" ],
        config: {
          randomValues: [ { user: "name", pass: "pass" } ]
        }
      },
    })

    const complexRandomObject = {
      complexArray: [
        "$PACKAGE_NAME",
        [ "first", "second", "$DOMAIN_NAME"],
        {
          stage: "$STAGE_NAME",
          name: "$RANDOM_NAME"
        }
      ],
      complexObject: {
        coolArray: [ "$RANDOM_NAME" ],
        coolObject: {
          name: "$$RANDOM_NAME",
          stages: ["$STAGE_NAME", "test"]
        }
      }
    }

    loadedScheme = loadEnvironmentVariables(complexRandomObject)
    const updatedArray = [ "package", [ "first", "second", "test1.eth" ], { stage: "stage", name: "name"}]
    const updatedObject = {
      coolArray: [ "name" ],
      coolObject: {
        name: "$RANDOM_NAME",
        stages: ["stage", "test"]
      }
    }
    expect(loadedScheme).toEqual({
      complexArray: updatedArray,
      complexObject: updatedObject
    })
  });
});
