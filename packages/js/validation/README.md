# Polywrap Validation (@polywrap/package-validation)

# Description 

Utilities for the validation of WRAP packages. Allows to implement custom constraints to
check if a WRAP package is valid

The main two entities here are `WasmPackageValidator` and `FileSystemPackageReader`

# Usage

```typescript
import { WasmPackageValidator, FileSystemPackageReader } from "@polywrap/package-validation"

// Size unit is KB
const validator = new WasmPackageValidator({
    maxSize: 1_000_000,
    maxFileSize: 1_000_000,
    maxModuleSize: 1_000_000,
    maxNumberOfFiles: 10,
});

const reader = new FileSystemPackageReader("absolute/path/to/package/folder")
const result = await validator.validate(result)
```


