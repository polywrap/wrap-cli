export function unionTypeTrim() {
  return (text: string, render: (text: string) => string): string => {
    const rendered: string = render(text);
    if (rendered.endsWith(" | ")) {
      return rendered.substring(0, rendered.length - 3);
    } else if (rendered.startsWith(" | ")) {
      return rendered.substring(3);
    }
    return rendered;
  };
}

export function typeFormatFilter() {
  return (text: string, render: (text: string) => string): string => {
    const rendered: string = render(text);
    if (rendered.startsWith("[")) {
      return rendered.substring(1, rendered.length - 1) + "[]";
    }
    return rendered;
  };
}

export function isMutation() {
  return (text: string, render: (text: string) => string): string => {
    const rendered: string = render(text);
    const firstReturn: number = rendered.indexOf("\n", 1);
    const queryType: string = rendered.substring(1, firstReturn).trim();
    if (queryType === "mutation") {
      return rendered.substring(firstReturn + 1);
    }
    return "";
  };
}

export function isQuery() {
  return (text: string, render: (text: string) => string): string => {
    const rendered: string = render(text);
    const firstReturn: number = rendered.indexOf("\n", 1);
    const queryType: string = rendered.substring(1, firstReturn).trim();
    if (queryType === "query") {
      return rendered.substring(firstReturn + 1);
    }
    return "";
  };
}

export function hashtagPrefix() {
  return (text: string, render: (text: string) => string): string => {
    const rendered: string = render(text);
    if (rendered === "") {
      return "";
    }
    return "# " + rendered;
  };
}

export function markdownItalics() {
  return (text: string, render: (text: string) => string): string => {
    const rendered: string = render(text);
    if (rendered === "") {
      return "";
    }
    return "_" + rendered + "_";
  };
}

export function title() {
  return (text: string, render: (text: string) => string): string => {
    const rendered: string = render(text);
    return rendered.charAt(0).toUpperCase() + rendered.substring(1);
  };
}
export function lowerFirst() {
  return (text: string, render: (text: string) => string): string => {
    const rendered: string = render(text);
    return rendered.charAt(0).toLowerCase() + rendered.substring(1);
  };
}
