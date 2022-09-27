export type Migration = {
  from: string;
  to: string;
  migrateFn: (manifest: unknown) => unknown;
};
