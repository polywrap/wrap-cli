import { Args_throwsInTwoSubinvokeLayers, Args_subWrapperNotFound, BadMath_Module, NotFound_Module, IModule } from "./wrap";
import { Args_subInvokeWillThrow as BadMathArgs_subInvokeWillThrow } from "./wrap/imported/BadMath_Module/serialization";
import { Args_subInvokeWillThrow as NotFoundArgs_subInvokeWillThrow } from "./wrap/imported/NotFound_Module/serialization";

export class Module extends IModule {
  throwsInTwoSubinvokeLayers(args: Args_throwsInTwoSubinvokeLayers): i32 {
    let importedArgs: BadMathArgs_subInvokeWillThrow = {
      a: args.a,
      b: args.b
    }
    return BadMath_Module.subInvokeWillThrow(importedArgs).unwrap()
  }
  subWrapperNotFound(args: Args_subWrapperNotFound): i32 {
    let importedArgs: NotFoundArgs_subInvokeWillThrow = {
      a: args.a,
      b: args.b
    }
    return NotFound_Module.subInvokeWillThrow(importedArgs).unwrap()
  }
}