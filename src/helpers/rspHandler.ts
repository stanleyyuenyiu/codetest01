'use strict';
import Logger from '../helpers/logger';
const logger = Logger('rspHandler');

export default {
  transform: async function (request: any) {
    return new Promise(async (resolve: any, reject: any) => {
      try {
        const {
          url,
          headers,
          method,
          params,
          payload,
          info,
          response,
        } = request;
        const { statusCode, data, source, output } = response;
        const rspHeaders = response.headers;
        const _source = source
          ? typeof source === 'string'
            ? JSON.parse(source)
            : source
          : null;
        const id = info ? info.id : null;

        const _requestToLog = {
          request: {
            id,
            url,
            headers,
            method,
            params,
            payload,
            info,
          },
        };
        const _responseToLog = {
          response: {
            id,
            headers: rspHeaders,
            statusCode,
            data,
            source: _source,
            output,
          },
        };

        const _response = {
          statusCode: null,
          body: {
            data: null,
            error: null,
          },
        } as any;

        if (response.isBoom) {
          _response.body.error = output.payload;
          _response.statusCode = output.statusCode;
          request.response.output.payload = _response.body;
        } else if (response.statusCode >= 500) {
          _response.body.error = _source;
          _response.statusCode = response.statusCode;
          request.response.output.payload = _response.body;
        } else {
          _response.statusCode = response.statusCode;
          _response.body.data = _source.data;
          delete _response.body.status;
          request.response.source = _response.body;
        }

        request.response.statusCode = _response.statusCode;
      } catch (err) {
        logger.error(err, `[handleResponse]`);
      } finally {
        return resolve();
      }
    });
  },

  alert: function (request: any) {
    const source = JSON.parse(request.response.source);
    const message = {
      ALERT: request.ALERT,
      type: request.ALERT_TYPE,
      message: [
        request.url,
        request.auth,
        request.headers,
        request.info,
        { payload: JSON.stringify(request.payload) },
      ],
      error: source ? source.stacktrace : request.response.data,
    };
    console.log(message);
  },
};
