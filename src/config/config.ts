'use strict';

export default {
  server: {
    host: '0.0.0.0',
    port: process.env.SERVER_PORT || 3000,
  },
  basePath: '/',
  cors: {
    allowOriginResponse: true,
    maxAge: 600,
  },
  mongodb: {
    uri:
      process.env.MONGODB_URI ||
      'mongodb://admin:password@localhost:27019/csv-data?authSource=admin',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      poolSize: 10,
    },
  },
  ignorePathPatterns: ['.*\\/documentation', '.*\\/metrics', '.*\\/swagger'],
  pino: {
    logPayload: true,
    logRequestStart: false,
    logRequestComplete: false,
    level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
    redact:
      process.env.NODE_ENV === 'production'
        ? ['req.headers.authorization']
        : [],
  },
};
