type MustacheFunction = () => (
  value: string, render: (template: string) => string
) => string

export const toGraphQL: MustacheFunction = () => {
  return (value: string, render: (template: string) => string) => {
    let name = render(value);
    let nullable = false;

    if (name[0] === "?") {
      name = name.substr(1);
      nullable = true;
    }

    if (name[0] === "[") {
      return toGraphQLArray(name, nullable);
    }

    return applyNullable(name, nullable);
  }
}

const toGraphQLArray = (name: string, nullable: boolean): string => {
  const result = name.match(/(\[)([?[\]A-Za-z1-9]+)(\])/);

  if (!result || result.length !== 4) {
    throw Error(`Invalid Array: ${name}`);
  }

  const graphqlType = toGraphQL()(result[2], (str) => str);
  return applyNullable(`[${graphqlType}]`, nullable);
}

const applyNullable = (name: string, nullable: boolean): string => {
  if (!nullable) {
    return name + '!';
  } else {
    return name;
  }
}
