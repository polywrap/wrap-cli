import {
  Args_getData,
  Args_setDataWithLargeArgs,
  Args_localVarMethod,
  Args_globalVarMethod,
  Args_subsequentInvokes,
  Args_setDataWithManyArgs,
  Args_setDataWithManyStructuredArgs,
  Storage_Module,
  IModule,
} from "./wrap";

let globalValue = false;

export class Module extends IModule {
  getData(args: Args_getData): u32 {
    const res = Storage_Module.getData({}).unwrap();
  
    return res;
  }

  returnTrue(): boolean {
    return true;
  }

  setDataWithLargeArgs(
    args: Args_setDataWithLargeArgs
  ): string {
    const largeString = args.value;
  
    Storage_Module.setData({
      value: U32.parseInt(args.value)
    }).unwrap();
  
    return largeString;
  }

  setDataWithManyArgs(args: Args_setDataWithManyArgs): string {
    const argsA = args.valueA;
    const argsB = args.valueB;
    const argsC = args.valueC;
    const argsD = args.valueD;
    const argsE = args.valueE;
    const argsF = args.valueF;
    const argsG = args.valueG;
    const argsH = args.valueH;
    const argsI = args.valueI;
    const argsJ = args.valueJ;
    const argsK = args.valueK;
    const argsL = args.valueL;
  
    Storage_Module.setData({
      value: 55
    }).unwrap();
  
    return argsA + argsB + argsC + argsD + argsE + argsF + argsG + argsH + argsI + argsJ + argsK + argsL;
  }

  setDataWithManyStructuredArgs(
    args: Args_setDataWithManyStructuredArgs
  ): boolean {
  
    Storage_Module.setData({
      value: 44
    }).unwrap();
  
    return true;
  }

  localVarMethod(args: Args_localVarMethod): boolean {
    let functionArg = false;
  
    functionArg = this.returnTrue();
  
    Storage_Module.setData({
      value: 88
    }).unwrap();
  
    return functionArg;
  }

  globalVarMethod(args: Args_globalVarMethod): boolean {
    globalValue = true;
  
    Storage_Module.setData({
      value: 77
    }).unwrap();
  
    return globalValue;
  }

  subsequentInvokes(args: Args_subsequentInvokes): string[] {
    const result: string[] = [];
  
    for (let i = 0; i < args.numberOfTimes; i++) {
      Storage_Module.setData({
        value: i
      }).unwrap();
  
      result[i] = Storage_Module.getData({}).unwrap().toString();
    }
  
    return result;
  }
}
