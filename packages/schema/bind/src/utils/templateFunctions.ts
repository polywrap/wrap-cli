export const fromReservedWord = (reservedWords: Set<string>) => {
  return () => {
    return (text: string, render: (text: string) => string): string => {
      const rendered: string = render(text);
      if (reservedWords.has(rendered)) {
        return "m_" + rendered;
      }
      return rendered;
    };
  };
};
