import {
  TypeInfo,
  createObjectDefinition,
  createQueryDefinition,
  createMethodDefinition,
  createImportedObjectDefinition,
  createImportedQueryDefinition,
  createScalarPropertyDefinition,
  createArrayPropertyDefinition
} from "../../../typeInfo";

export const output: TypeInfo = {
  userTypes: [
    {
      ...createObjectDefinition("CustomType", "CustomType"),
      properties: [
        createScalarPropertyDefinition("str", "String", true),
        createScalarPropertyDefinition("optStr", "?String", false),
        createScalarPropertyDefinition("u", "UInt", true),
        createScalarPropertyDefinition("optU", "?UInt", false),
        createScalarPropertyDefinition("u8", "UInt8", true),
        createScalarPropertyDefinition("u16", "UInt16", true),
        createScalarPropertyDefinition("u32", "UInt32", true),
        createScalarPropertyDefinition("u64", "UInt64", true),
        createScalarPropertyDefinition("i8", "Int8", true),
        createScalarPropertyDefinition("i16", "Int16", true),
        createScalarPropertyDefinition("i32", "Int32", true),
        createScalarPropertyDefinition("i64", "Int64", true),
        createArrayPropertyDefinition("uArray", "[UInt]", true,
          createScalarPropertyDefinition("uArray", "UInt", true)
        ),
        createArrayPropertyDefinition("uOptArray", "?[UInt]", false,
          createScalarPropertyDefinition("uOptArray", "UInt", true)
        ),
        createArrayPropertyDefinition("optUOptArray", "?[?UInt]", false,
          createScalarPropertyDefinition("optUOptArray", "?UInt", false)
        ),
        createArrayPropertyDefinition("optStrOptArray", "?[?String]", false,
          createScalarPropertyDefinition("optStrOptArray", "?String", false)
        ),
        createArrayPropertyDefinition("uArrayArray", "[[UInt]]", true,
          createArrayPropertyDefinition("uArrayArray", "[UInt]", true,
            createScalarPropertyDefinition("uArrayArray", "UInt", true)
          )
        ),
        createArrayPropertyDefinition("uOptArrayOptArray", "[?[?UInt64]]", true,
          createArrayPropertyDefinition("uOptArrayOptArray", "?[?UInt64]", false,
            createScalarPropertyDefinition("uOptArrayOptArray", "?UInt64", false)
          )
        ),
        createArrayPropertyDefinition("uArrayOptArrayArray", "[?[[UInt64]]]", true,
          createArrayPropertyDefinition("uArrayOptArrayArray", "?[[UInt64]]", false,
            createArrayPropertyDefinition("uArrayOptArrayArray", "[UInt64]", true,
              createScalarPropertyDefinition("uArrayOptArrayArray", "UInt64", true)
            )
          ),
        ),
        createArrayPropertyDefinition("crazyArray", "?[?[[?[UInt64]]]]", false,
          createArrayPropertyDefinition("crazyArray", "?[[?[UInt64]]]", false,
            createArrayPropertyDefinition("crazyArray", "[?[UInt64]]", true,
              createArrayPropertyDefinition("crazyArray", "?[UInt64]", false,
                createScalarPropertyDefinition("crazyArray", "UInt64", true)
              )
            )
          ),
        ),
      ]
    },
    {
      ...createObjectDefinition("AnotherType", "AnotherType"),
      properties: [
        createScalarPropertyDefinition("optStr", "?String", false),
      ]
    }
  ],
  queryTypes: [
    {
      ...createQueryDefinition("Query", "Query", true),
      methods: [
        {
          ...createMethodDefinition("query", "queryMethod"),
          arguments: [
            createScalarPropertyDefinition("arg", "String", true)
          ],
          return: createScalarPropertyDefinition("", "Int", true)
        }
      ]
    }
  ],
  importedObjectTypes: [
    {
      ...createImportedObjectDefinition(
        "testimport.uri.eth", "TestImport",
        "TestImport_Object", "Object"
      ),
      properties: [
        createScalarPropertyDefinition("prop", "String", true)
      ]
    }
  ],
  importedQueryTypes: [
    {
      ...createImportedQueryDefinition(
        "testimport.uri.eth", "TestImport",
        "TestImport_Query", "Query"
      ),
      methods: [
        {
          ...createMethodDefinition("query", "importedMethod"),
          arguments: [
            createScalarPropertyDefinition("str", "String", true),
            createScalarPropertyDefinition("optStr", "?String", false),
            createScalarPropertyDefinition("u", "UInt", true),
            createScalarPropertyDefinition("optU", "?UInt", false),
            createArrayPropertyDefinition("uArrayArray", "[?[?UInt]]", true,
              createArrayPropertyDefinition("uArrayArray", "?[?UInt]", false,
                createScalarPropertyDefinition("uArrayArray", "?UInt", false)
              )
            )
          ],
          return: createScalarPropertyDefinition("", "String", true)
        },
        {
          ...createMethodDefinition("query", "anotherMethod"),
          arguments: [
            createArrayPropertyDefinition("arg", "[String]", true,
              createScalarPropertyDefinition("arg", "String", true)
            )
          ],
          return: createScalarPropertyDefinition("", "Int64", true)
        }
      ]
    }
  ]
}
