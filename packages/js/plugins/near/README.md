### Sample Plugin

This is a sample plugin with sample query/mutation.
You can add new functionalities to it by following steps.

1. Add queries/mutations the `schema.graphql` file
2. Add resolvers for that to the `resolvers.ts` file.
   Use the Plugin class in the `index.ts` file to add helpers/methods to handle queries/mutations.
3. Update the `manifest.ts` file.
4. Run `yarn build`
