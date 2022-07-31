interface Named {
  name: string;
}

export function alphabeticalNamedSort(a: Named, b: Named): number {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
}
