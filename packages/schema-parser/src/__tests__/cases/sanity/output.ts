
import * as fs from 'fs';
import { createSetFirstLastPredicate } from '../../../helpers';
import { buildTypeInfo } from '../../../parsing';
import { GenericTransformPredicate, transformTypeInfo } from '../../../transform';
import { TypeDefinition } from '../../../typeInfo';


// @TODO: Refactor into a real test

const schemaContents = fs.readFileSync('./src/__tests__/cases/sanity/input.graphql').toString();

const tInfo = buildTypeInfo(schemaContents);

fs.writeFileSync('./before.json', JSON.stringify(tInfo, undefined, 2));

const predicate = createSetFirstLastPredicate();
transformTypeInfo(tInfo, predicate);

const addThoseMustacheFunctions: GenericTransformPredicate = (def: TypeDefinition): any => {
  return {
    myFunction: () => {
      console.log("Hello world");
      console.log("my name was " + def.name);
    }
  }
}
transformTypeInfo(tInfo, addThoseMustacheFunctions);

const addSomeRandomField: GenericTransformPredicate = (def: TypeDefinition): any => {
  return {
    randomField: 1337
  }
}
transformTypeInfo(tInfo, addSomeRandomField);

fs.writeFileSync('./after.json', JSON.stringify(tInfo, undefined, 2));

(tInfo.userTypes[0] as any).myFunction();
// Prints:
//    Hello world
//    my name was CustomType