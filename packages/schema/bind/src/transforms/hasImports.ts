import { Abi, ImportedAbi } from "@polywrap/abi-types";
import { IAbiVisitor, IAbiVisitorEnterAndLeave } from "@polywrap/schema-abi";

type HasImportsAbi = Abi & { hasImports: boolean };
type HasImportsImportedAbi = ImportedAbi & { hasImports: boolean };

interface HasImportsAbiVisitor extends IAbiVisitor {
  Abi: (abi: HasImportsAbi) => HasImportsAbi;
  Import: (abi: HasImportsImportedAbi) => HasImportsImportedAbi;
}

interface IHasImportsAbiVisitorEnterAndLeave extends IAbiVisitorEnterAndLeave {
  enter: HasImportsAbiVisitor;
}

export const hasImports: IHasImportsAbiVisitorEnterAndLeave = {
  enter: {
    Abi: (abi: HasImportsAbi): HasImportsAbi => {
      if (abi.imports && abi.imports.length > 0) {
        abi.hasImports = true;
      } else {
        abi.hasImports = false;
      }
  
      return abi;
    },
    Import: (abi: HasImportsImportedAbi): HasImportsImportedAbi => {
      if (abi.imports && abi.imports.length > 0) {
        abi.hasImports = true;
      } else {
        abi.hasImports = false;
      }
  
      return abi;
    },
  }
}