export const composedSchema = {
  query:
    "### Web3API Header START ###\n" +
    "scalar UInt\n" +
    "scalar UInt8\n" +
    "scalar UInt16\n" +
    "scalar UInt32\n" +
    "scalar UInt64\n" +
    "scalar Int\n" +
    "scalar Int8\n" +
    "scalar Int16\n" +
    "scalar Int32\n" +
    "scalar Int64\n" +
    "scalar Bytes\n" +
    "\n" +
    "directive @imported(\n" +
    "  uri: String!\n" +
    "  namespace: String!\n" +
    "  nativeType: String!\n" +
    ") on OBJECT | ENUM\n" +
    "\n" +
    "directive @imports(\n" +
    "  types: [String!]!\n" +
    ") on OBJECT\n" +
    "### Web3API Header END ###\n" +
    "\n" +
    "type Query {\n" +
    "  getData(address: String!): Int!\n" +
    "}\n" +
    "\n" +
    "### Imported Queries START ###\n" +
    "\n" +
    "### Imported Queries END ###\n" +
    "\n" +
    "### Imported Objects START ###\n" +
    "\n" +
    "### Imported Objects END ###\n",
  mutation:
    "### Web3API Header START ###\n" +
    "scalar UInt\n" +
    "scalar UInt8\n" +
    "scalar UInt16\n" +
    "scalar UInt32\n" +
    "scalar UInt64\n" +
    "scalar Int\n" +
    "scalar Int8\n" +
    "scalar Int16\n" +
    "scalar Int32\n" +
    "scalar Int64\n" +
    "scalar Bytes\n" +
    "\n" +
    "directive @imported(\n" +
    "  uri: String!\n" +
    "  namespace: String!\n" +
    "  nativeType: String!\n" +
    ") on OBJECT | ENUM\n" +
    "\n" +
    "directive @imports(\n" +
    "  types: [String!]!\n" +
    ") on OBJECT\n" +
    "### Web3API Header END ###\n" +
    "\n" +
    "type Mutation {\n" +
    "  setData(address: String!, value: UInt32!): String!\n" +
    "\n" +
    "  deployContract: String!\n" +
    "}\n" +
    "\n" +
    "### Imported Queries START ###\n" +
    "\n" +
    "### Imported Queries END ###\n" +
    "\n" +
    "### Imported Objects START ###\n" +
    "\n" +
    "### Imported Objects END ###\n",
  combined:
    "### Web3API Header START ###\n" +
    "scalar UInt\n" +
    "scalar UInt8\n" +
    "scalar UInt16\n" +
    "scalar UInt32\n" +
    "scalar UInt64\n" +
    "scalar Int\n" +
    "scalar Int8\n" +
    "scalar Int16\n" +
    "scalar Int32\n" +
    "scalar Int64\n" +
    "scalar Bytes\n" +
    "\n" +
    "directive @imported(\n" +
    "  uri: String!\n" +
    "  namespace: String!\n" +
    "  nativeType: String!\n" +
    ") on OBJECT | ENUM\n" +
    "\n" +
    "directive @imports(\n" +
    "  types: [String!]!\n" +
    ") on OBJECT\n" +
    "### Web3API Header END ###\n" +
    "\n" +
    "type Query {\n" +
    "  getData(address: String!): Int!\n" +
    "}\n" +
    "type Mutation {\n" +
    "  setData(address: String!, value: UInt32!): String!\n" +
    "\n" +
    "  deployContract: String!\n" +
    "}\n" +
    "\n" +
    "### Imported Queries START ###\n" +
    "\n" +
    "### Imported Queries END ###\n" +
    "\n" +
    "### Imported Objects START ###\n" +
    "\n" +
    "### Imported Objects END ###\n",
};
