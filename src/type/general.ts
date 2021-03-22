import * as Hapi from '@hapi/hapi';

export type QueryRequest = Hapi.Request & {
  query: {
    from?: string
    to?: string
  }
};
