'use strict';
import Config from '../../../config/config';
import Logger from '../../../helpers/logger';
import * as Boom from '@hapi/boom';
import UploadController from '../../../api/controllers/upload';
const uploadController = new UploadController();
const basePath = Config.basePath;
const logger = Logger('controller:payment');

export default {
  pkg: require('../../../../package.json'),
  name: 'upload_routes_v1',
  register: async (plugin: any, options: any) => {
    plugin.route([
      {
        method: 'POST',
        path: basePath + 'sales/record',
        config: {
          description: 'upload csv',
          payload: {
            output: 'stream',
            parse: true,
            allow: 'multipart/form-data',
            multipart: true,
            maxBytes: 2000 * 1000 * 1000,
          },
          handler: uploadController.Request,
          timeout: {
            server: 60000 * 20,
            socket: 60000 * 50,
          },
        },
      },
      {
        method: 'GET',
        path: basePath + 'sales/report',
        config: {
          description: 'query data',
          validate: {
            options: {
              allowUnknown: true,
            },
            failAction: async (
              request: any,
              h: any,
              error: any
            ): Promise<any> => {
              logger.error(error, `[Response] caught exception`);
              return Boom.boomify(error);
            },
          },
          handler: uploadController.Response
        },
      },
    ]);
  },
};
