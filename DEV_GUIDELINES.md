# Polywrap Core Development Guidelines

Guidelines for the core development contributors on the Polywrap monorepo written to have a better understanding of Polywrap progress and coordination. Recommended read for new developers as part of onboarding. 

## Issues management

All planned features, bugs and enhancements are represented as a Github issue with an appropriate description, examples and issue labels.

Issues should be part of an according Github project that has an automated kanban board consisting of columns that mark the issue status and can be *Unassigned*, *Assigned*, *In progress* and *Done*. *Backlog* column is used for keeping the available issues that are up for grabs and also when creating new tasks such as features, bug fixes or ideas. 

![Github project board](https://i.imgur.com/aLWa5HQ.png)

Github projects are created for each project where there is always one active project board for core development i.e. [Prealpha board](https://github.com/polywrap/monorepo/projects/1) and others for development of other parts like Polywrappers such as [Uniswap](https://github.com/polywrap/monorepo/projects/2).

Milestones in the Github projects are oriented to specific goals such as releases (bigger or smaller) as the progress can be measured for an estimate of time left until release.

### Issue development lifecycle

When taking an issue to be resolved, one should:

* Set assigned user in the issue
* Set in progress status in Github project

Once development of that issue is finished, a pull request (PR) should be created filling all information from the PR template.

Before creating the pull request contributor should make sure that changes will pass **[CI actions](https://github.com/polywrap/monorepo/blob/prealpha/.github/workflows/js-ci.yaml)** which include:

* passing lint without any errors
* successful build
* passing the complete test suite

For the pull request a relevant contributors will be set as reviewers. At least two people should approve the PR in order to merge it.

## Testing

In Polywrap monorepo currently unit tests can be found in almost all packages and covering new code with unit tests is mandatory. Unit tests can be found in the `__tests__` directory of the each package source while tests inputs and outputs can be found in the [test-cases directory](https://github.com/polywrap/monorepo/tree/prealpha/packages/test-cases).

End to end (e2e) tests are recommended when complete integration is being tested like for CLI commands or a certain code is working with an external interface like an HTTP plugin. An example of such tests are [HTTP plugin e2e tests](https://github.com/polywrap/monorepo/blob/prealpha/packages/js/plugins/http/src/__tests__/e2e/e2e.spec.ts) and [CLI e2e tests](https://github.com/polywrap/monorepo/tree/prealpha/packages/cli/src/__tests__/e2e).


## Releases

Polywrap rolling releases can be found on [NPM](https://www.npmjs.com/org/polywrap) and [Github](https://github.com/polywrap/monorepo/releases).

Currently only the people listed in the [.github/PUBLISHERS](PUBLISHERS) file can make releases using the CI (Github actions) flow. To make a new release one should:

1. Update the [VERSION](VERSION) file and the changelog.
2. Make a pull request from the ${release}-dev branch into the ${release} branch
3. After the pull request is merged, make a comment on the pull request with content: `/workflows/release-pr`
4. The Polywrap build bot will create a new release pull request for the ${release branch} and comment a link to it on the pull request it was commented on.
5. In this new release pull request, copy & paste the changelog into the pull request's description section. This is what will be used for the Github release notes.
6. Add the "Polywrap-Release" Github tag to the pull request.
7. If this new pull request is merged, the release workflow will be run, publishing a new git tag, git release and all NPM packages.

### Branches

Currently, there are 2 active branches with configured branch policies:
* **Release** (ex. `prealpha`)
   * 1 or more publishers must approve.
* **Dev** (ex. `prealpha-dev`)
   * 2 or more developers working on the project must approve. 


### Changelog

For each new release a new log in the [CHANGELOG.md](https://github.com/polywrap/monorepo/blob/prealpha/CHANGELOG.md) file should be added manually listing the changes done like new features or bug fixing.

## Code ownership

A [CODEOWNERS file](https://github.com/polywrap/monorepo/blob/prealpha/.github/CODEOWNERS) is used to define individuals or teams that are responsible for code in a repository. Code owners are automatically requested for review when someone opens a pull request.

Code owners can be defined using a certain [syntax](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/about-code-owners#codeowners-syntax) for a project globally or for a certain part of the code (directory) so only people that have worked on certain parts are really the defined code owners.
