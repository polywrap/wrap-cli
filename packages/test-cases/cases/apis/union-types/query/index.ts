import {
  Input_argMethod,
  Input_returnMethod,
  Input_arrayMethod,
  Input_optionalMethod,
  TypeUnionA,
  TypeUnionB,
  TypeUnion,
} from "./w3";

export function argMethod(input: Input_argMethod): string {
  if(input.arg.isArgUnionA) {
    return input.arg.ArgUnionA.prop;
  }

  return input.arg.ArgUnionB.prop.toString();
}

export function returnMethod(input: Input_returnMethod): TypeUnion {
  if(input.arg) {
    return TypeUnion.create<TypeUnionA>({
      propA: 1
    });
  }

  return TypeUnion.create<TypeUnionB>({
    propB: true
  });
}

export function arrayMethod(input: Input_arrayMethod): Array<i32> {
  return input.arg.map<i32>(union => {
    if(union.isArgUnionA) {
      return 1;
    } else if(union.isArgUnionB) {
      return 2;
    } else {
      return 3;
    }
  });
}

export function optionalMethod(input: Input_optionalMethod): Array<TypeUnion> | null {
  if(input.arg) {
    return [TypeUnion.create<TypeUnionA>({
      propA: 1
    }), TypeUnion.create<TypeUnionB>({
      propB: true
    })];
  }

  return null;
}