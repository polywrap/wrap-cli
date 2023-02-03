# @polywrap/schema-parse

Parse & validate WRAP schemas, converting them into a WRAP ABI structure. Optionally perform transformations upon the WRAP ABI.

## Usage
```typescript
import {
  Abi,
  parseSchema,
  ParserOptions
} from "@polywrap/schema-parse";

const schema = readFileSync("module.graphql", "utf-8");
const options: ParserOptions = { };

const abi: Abi = parseSchema(schema, options);
```

### Options
```typescript
interface ParserOptions {
  // Disable schema validation
  noValidate?: boolean;
  // Use custom validators
  validators?: SchemaValidatorBuilder[];
  // Use custom extractors
  extractors?: SchemaExtractorBuilder[];
  // Use custom transformations
  transforms?: AbiTransforms[];
}
```

### ABI Transforms
ABI transformations can be used to modify the ABI structure. A variety of pre-defined transformations can be found in the ./src/transform/ directory.

Example:
```typescript
import {
  Abi,
  AbiTransforms,
  GenericDefinition,
  parseSchema
} from "@polywrap/schema-parse";

function extendType(extension: any): AbiTransforms {
  return {
    enter: {
      Abi: (abi: Abi) => ({
        ...abi,
        extension,
      }),
      GenericDefinition: (def: GenericDefinition) => ({
        ...def,
        ...extension,
      }),
    },
  };
}
```

Usage:
```typescript
parseSchema(schema, {
  transforms: [
    extendType({ newProp: "foo" })
  ]
});
```
