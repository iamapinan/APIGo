export interface MockResponse {
  id: string;
  statusCode: number;
  body: string | null;
  headers: { key: string; value: string; isEnabled: boolean }[] | null;
}

export interface MockEndpoint {
  id: string;
  path: string;
  method: string;
  description: string | null;
  isPublic: boolean;
  rateLimit: number;
  responses: MockResponse[];
}
