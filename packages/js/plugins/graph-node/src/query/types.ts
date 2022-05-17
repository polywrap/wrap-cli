export interface RequestError {
  errors: {
    locations: { column: number; line: number }[];
    message: string;
  }[];
}

export interface RequestData {
  data: Record<string, unknown>;
}
