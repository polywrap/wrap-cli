export type Migrator = {
  from: string;
  to: string;
  migrate: (manifest: unknown) => unknown;
};
