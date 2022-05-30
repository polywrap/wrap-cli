import {Project} from "../../lib";

describe("Unit tests for Project", () => {
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
          domainName: "$DOMAIN_NAME"
        }
      }
    }
    let loadedScheme =  Project.loadEnvironmentVariables(simpleDeploySchema)
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
    loadedScheme = Project.loadEnvironmentVariables(complexDeploySchema)
    expect(loadedScheme).toEqual({
      ...complexDeploySchema,
      from_deploy: {
        ...complexDeploySchema.from_deploy,
        config: {
          domainName: "test1.eth"
        }
      },
      another_from_deploy: {
        package: "cool package",
        depends_on: [ "ipfs_deploy", "from_deploy", "cool stage" ],
        config: {
          randomValues: [ { user: "cool user", pass: "pass" } ]
        }
      },
    })
  });
});
