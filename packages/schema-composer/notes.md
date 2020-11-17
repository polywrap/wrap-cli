# Notes

- Toss out mustache
  - This can be accomplished by just using GraphQL

## Import process

- Find out all the schemas we're going to need to work with
  - For each schema:
    - Determine what types are needed
      - The user gives us a set, but that set may depend on others
        - Use AST tree crawling to figure that out


Considering using graphql-tools to help with this

- They support loading types from external sources
- Not exactly what we need though

https://www.graphql-tools.com/docs/schema-loading/
https://www.graphql-tools.com/docs/loaders
