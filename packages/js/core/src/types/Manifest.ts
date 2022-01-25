/* eslint-disable @typescript-eslint/naming-convention */
export interface Manifest {
  format: string;
  language: string;
  modules: {
    mutation?: {
      schema: string;
      module?: string;
    };
    query?: {
      schema: string;
      module?: string;
    };
  };
  __type: string;
}
