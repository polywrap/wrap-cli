import { WrapAbi } from "@polywrap/schema-parse";

export const abi: WrapAbi = {
  objectTypes: [
    {
      type: "ModuleInterfaceArgument",
      kind: 1,
      properties: [
        {
          type: "String",
          name: "str",
          required: true,
          kind: 34,
          scalar: {
            type: "String",
            name: "str",
            required: true,
            kind: 4
          }
        },
        {
          type: "UInt8",
          name: "uint8",
          required: true,
          kind: 34,
          scalar: {
            type: "UInt8",
            name: "uint8",
            required: true,
            kind: 4
          },
          comment: "uint8 comment"
        }
      ],
      interfaces: [
        {
          type: "NestedModuleInterfaceArgument",
          kind: 2048
        }
      ],
      comment: "ModuleInterfaceArgument comment"
    },
    {
      type: "NestedModuleInterfaceArgument",
      kind: 1,
      properties: [
        {
          type: "UInt8",
          name: "uint8",
          required: true,
          kind: 34,
          scalar: {
            type: "UInt8",
            name: "uint8",
            required: true,
            kind: 4
          }
        }
      ],
      comment: "NestedModuleInterfaceArgument comment"
    },
    {
      type: "InterfaceObject1",
      kind: 1,
      properties: [
        {
          type: "String",
          name: "str",
          required: true,
          kind: 34,
          scalar: {
            type: "String",
            name: "str",
            required: true,
            kind: 4
          }
        },
        {
          type: "UInt8",
          name: "uint8",
          required: true,
          kind: 34,
          scalar: {
            type: "UInt8",
            name: "uint8",
            required: true,
            kind: 4
          },
          comment: "InterfaceObject1_uint8 comment"
        }
      ],
      comment: "InterfaceObject1 comment"
    },
    {
      type: "InterfaceObject2",
      kind: 1,
      properties: [
        {
          type: "String",
          name: "str2",
          required: true,
          kind: 34,
          scalar: {
            type: "String",
            name: "str2",
            required: true,
            kind: 4
          }
        },
        {
          type: "Object",
          name: "object",
          kind: 34,
          object: {
            type: "Object",
            name: "object",
            kind: 8192
          }
        }
      ],
      interfaces: [
        {
          type: "NestedInterfaceObject",
          kind: 2048
        }
      ],
      comment: "InterfaceObject2 comment"
    },
    {
      type: "NestedInterfaceObject",
      kind: 1,
      properties: [
        {
          type: "Object",
          name: "object",
          kind: 34,
          object: {
            type: "Object",
            name: "object",
            kind: 8192
          },
          comment: "object comment"
        }
      ],
      comment: "NestedInterfaceObject comment"
    },
    {
      type: "Object",
      kind: 1,
      properties: [
        {
          type: "UInt8",
          name: "uint8",
          required: true,
          kind: 34,
          scalar: {
            type: "UInt8",
            name: "uint8",
            required: true,
            kind: 4
          }
        }
      ],
      comment: "Object comment"
    }
  ],
  moduleType: {
    type: "Module",
    kind: 128,
    methods: [
      {
        type: "Method",
        name: "abstractModuleMethod",
        required: true,
        kind: 64,
        arguments: [
          {
            type: "ModuleInterfaceArgument",
            name: "arg",
            required: true,
            kind: 34,
            object: {
              type: "ModuleInterfaceArgument",
              name: "arg",
              required: true,
              kind: 8192
            },
            comment: "arg comment"
          }
        ],
        return: {
          type: "InterfaceObject2",
          name: "abstractModuleMethod",
          required: true,
          kind: 34,
          object: {
            type: "InterfaceObject2",
            name: "abstractModuleMethod",
            required: true,
            kind: 8192
          }
        },
        comment: "abstractModuleMethod comment"
      }
    ],
    comment: "Module comment"
  }
};
