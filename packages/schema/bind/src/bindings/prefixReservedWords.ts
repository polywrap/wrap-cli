export const prefixReservedWords = () => {
  return (text: string, render: (text: string) => string): string => {
    const rendered: string = render(text);
    if (rendered in reservedWords) {
      return "m_" + rendered;
    }
    return rendered;
  };
};

const reservedWords: string[] = ["const"];
