'use strict';
import Config from './config';
const Confidence = require('confidence');
const HapiPino = require('hapi-pino');
const HapiCors = require('hapi-modern-cors');
import MongoDB from '../lib/mongodb';
import UploadRoute from '../api/routes/v1/upload';

const internals = {
  criteria: {
    env: process.env.NODE_ENV,
  },
} as any;

internals.manifest = {
  server: {
    host: Config.server.host,
    port: Config.server.port,
  },
  register: {
    plugins: [
      // Debugging
      {
        plugin: require('hapi-dev-errors'),
        options: {
          showErrors: process.env.NODE_ENV !== 'production',
        },
      },
      {
        plugin: MongoDB,
        options: Config.mongodb,
      },

      // Logging pino
      {
        plugin: HapiPino,
        options: Config.pino,
      },
      // Static file and directory handlers
      {
        plugin: '@hapi/inert',
      },
      {
        plugin: '@hapi/vision',
      },
      {
        plugin: UploadRoute,
      },
      // API routes cors
      {
        plugin: HapiCors,
        options: Config.cors,
      },
    ],
  },
};

internals.store = new Confidence.Store(internals.manifest);

export default {
  get: (key: any) => internals.store.get(key, internals.criteria),
  meta: (key: any) => internals.store.meta(key, internals.criteria),
};
