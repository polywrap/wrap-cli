# Toolchain Development Guidelines

Guidelines for polywrap toolchain contributors. Have questions? https://discord.polywrap.io

## GitHub Issues

All planned features, bugs, and enhancements are represented as [GitHub issues](https://github.com/polywrap/toolchain/issues). Once created, issues can be brought into the ["Polywarp Release Roadmap"](https://github.com/orgs/polywrap/projects/6), where we track all in-progress roadmaps. [Milestones in GitHub repositories](https://github.com/polywrap/toolchain/milestones) are used to organize issues into [individual roadmaps](https://github.com/orgs/polywrap/projects/6/views/13).

## Testing

Tests for toolchain packages can be found in the can be found in the individual packages. Additionally there are various reusable integration test cases defined in the [test-cases directory](https://github.com/polywrap/toolchain/tree/origin/packages/test-cases).

### Dependencies

Some tests rely on additional system-wide dependencies being installed. These include:
- [`docker buildx`](https://docs.docker.com/engine/reference/commandline/buildx/)
- [`cue`](https://cuelang.org)

### WRAP Integration Testing
In the test-cases directory, you can find the `wrappers` folder, which is auto generated from the releases of the [WRAP Test Harness](https://github.com/polywrap/wrap-test-harness). The WRAP Test Harness is used to ensure the toolchain is compliant with the various WRAP versions it is supposed to support.

If your changes within the toolchain repo include breaking changes to the wrap developer experience, please modify the WRAP Test Harness accordingly by [following the development guidelines written here](https://github.com/polywrap/wrap-test-harness#build--contribute).

## Branches

The toolchain repo organizes branches in the following ways:
* **Release**
   * 1 or more [publishers](./.github/PUBLISHERS) must approve
   * ex: `origin`, `origin-0.9`, etc
* **Dev**
   * 2 or more developers working on the project must approve
   * ex: `origin-dev`, `origin-0.9-dev`, etc

## Changelog

For each new release, a new entry in the [CHANGELOG.md](CHANGELOG) file should be added manually listing the changes done like new features or bug fixing.

## Releases

The toolchain's releases can be found on [NPM](https://www.npmjs.com/org/polywrap) and [Github](https://github.com/polywrap/monorepo/releases).

Only the people listed in the [.github/PUBLISHERS](./github/PUBLISHERS) file can initiate releases. To make a new release, a publisher should:

1. Update the [VERSION](VERSION) and [CHANGELOG](CHANGELOG) files.
2. Make a pull request from the ${release}-dev branch into the ${release} branch, appending to the PR's title `/workflows/release-pr`
3. The [`polywrap-build-bot`](https://github.com/polywrap-build-bot) will prepare a new release pull request for the ${release} branch, and comment a link to it on the pull request it was initiated from.
4. In this new release pull request, copy & paste the changelog into the pull request's description section. This is what will be used for the Github release notes.
5. Add the "Polywrap-Release" Github tag to the pull request.
6. If this new pull request is merged, the release workflow will be run, publishing a new git tag, git release, and all packages.

## Code Owners

The [CODEOWNERS](./.github/CODEOWNERS) file is used to define individuals or teams that are responsible for code in the repository. Code owners are automatically requested for review when someone opens a pull request.

Code owners can be defined using a certain [syntax](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/about-code-owners#codeowners-syntax) for a project globally or for a certain part of the code (directory) so only people that have worked on certain parts are really the defined code owners.
