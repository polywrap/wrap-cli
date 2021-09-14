export const fromReservedWord = (reservedWords: string[]) => {
  return () => {
    return (text: string, render: (text: string) => string): string => {
      const rendered: string = render(text);
      if (reservedWords.includes(rendered)) {
        return "m_" + rendered;
      }
      return rendered;
    };
  };
};
