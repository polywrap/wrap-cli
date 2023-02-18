# Polywrap Core Development Guidelines

Guidelines for the core development contributors on the Polywrap monorepo written to have a better understanding of Polywrap progress and coordination. Recommended read for new developers as part of onboarding. 

## Issues management

All planned features, bugs, and enhancements are represented as a Github issue with appropriate description, examples, and issue labels.  

Once created, issues can be brought into the [repository's "project"](https://github.com/polywrap/monorepo/projects/1), an automated kanban board consisting of columns that mark the issue status and can be *Unassigned*, *Assigned*, *In progress* and *Done*. *Backlog* column is used for keeping the available issues that are up for grabs and also when creating new tasks such as features, bug fixes or ideas.  

![Github project board](https://i.imgur.com/aLWa5HQ.png)

Milestones in the Github projects are oriented to specific goals such as releases (bigger or smaller) as the progress can be measured for an estimate of time left until release.

### Issue development lifecycle

When taking an issue to be resolved, one should:

* Set assigned user in the issue
* Set "in progress" status in Github project

Once development of that issue is finished, a pull request (PR) should be created, detailing what the intended changes made were, so that others may properly evaluate with full context.

Before creating the pull request contributor should make sure that changes will pass **[CI actions](https://github.com/polywrap/monorepo/blob/origin/.github/workflows/js-ci.yaml)** which include:

* linting
* full re-build
* automated tests

All relevant contributors will automatically be set as reviewers. At least two people should approve the PR in order to merge it.

Please feel free to "socialize" the PR within our [Discord](https://discord.polywrap.io/) to gain other developer's attention. If things sit for a while, it's most likely that it has been off other people's radars, and it's okay to bring it up again so that it may be addressed.

## Testing

In Polywrap monorepo currently unit tests can be found in almost all packages and **covering new code with unit tests is mandatory**. Unit tests can be found in the `__tests__` directory of the each package source. Additionally some re-usable test inputs and outputs can be found in the [test-cases directory](https://github.com/polywrap/monorepo/tree/origin/packages/test-cases).

End to end (e2e) tests are recommended when complete integration is being tested like for CLI commands or a certain code is working with an external interface like an HTTP plugin. An example of such tests are [HTTP plugin e2e tests](https://github.com/polywrap/monorepo/blob/origin/packages/js/plugins/http/src/__tests__/e2e/e2e.spec.ts) and [CLI e2e tests](https://github.com/polywrap/monorepo/tree/origin/packages/cli/src/__tests__/e2e).

### Additional dependencies for testing

Some tests rely on validating `stdout` for which Cue is used. If you need to run a full test suite, you will have to install Cue.

You can install Cue by following the instructions found [here](https://cuelang.org/docs/install/).

In the test-cases directory, you can find the `wrappers` folder, which is auto generated from the releases of the
[WASM Test Harness](https://github.com/polywrap/wasm-test-harness), check the `fetchWrappers` function from the [test-cases package](./packages/test-cases/index.ts). These tests are used mostly for client tests, if you would like to
modify them, [follow the development guide of the wasm test harness](https://github.com/polywrap/wasm-test-harness#build--contribute).

If any PR modifies `packages/wasm`, `packages/cli` or `packages/schema`, it will try to generate wrappers on CI based on the changes
introduced on the PR (You can check the workflow in detail [here](https://github.com/polywrap/wasm-test-harness/blob/master/.github/workflows/generate-wrappers.yaml#L14)).
For this, a new branch in the Test Harness need to be opened **with the same name** of the base branch from the PR

## Branches

Currently, there are 2 active branches with configured branch policies:
* **Release** (ex. `origin`)
   * 1 or more [publishers](./github/PUBLISHERS) must approve.
* **Dev** (ex. `origin-dev`)
   * 2 or more developers working on the project must approve. 

## Releases

Polywrap rolling releases can be found on [NPM](https://www.npmjs.com/org/polywrap) and [Github](https://github.com/polywrap/monorepo/releases).

Currently only the people listed in the [.github/PUBLISHERS](./github/PUBLISHERS) file can make releases using the CI (Github actions) flow. To make a new release one should:

1. Update the [VERSION](VERSION) and [CHANGELOG](CHANGELOG) files.
2. Make a pull request from the ${release}-dev branch into the ${release} branch
3. After the pull request is merged, make a comment on the pull request with content: `/workflows/release-pr`
4. The Polywrap build bot will create a new release pull request for the ${release branch} and comment a link to it on the pull request it was commented on.
5. In this new release pull request, copy & paste the changelog into the pull request's description section. This is what will be used for the Github release notes.
6. Add the "Polywrap-Release" Github tag to the pull request.
7. If this new pull request is merged, the release workflow will be run, publishing a new git tag, git release and all NPM packages.

### Changelog

For each new release a new log in the [CHANGELOG.md](CHANGELOG) file should be added manually listing the changes done like new features or bug fixing.

## Code ownership

A [CODEOWNERS file](./github/CODEOWNERS) is used to define individuals or teams that are responsible for code in a repository. Code owners are automatically requested for review when someone opens a pull request.

Code owners can be defined using a certain [syntax](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/about-code-owners#codeowners-syntax) for a project globally or for a certain part of the code (directory) so only people that have worked on certain parts are really the defined code owners.
