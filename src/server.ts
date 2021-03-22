'use strict';
process.on('unhandledRejection', function (err) {
  console.error(err);
  process.exit(1);
});
import Config from './config/config';
import Manifest from './config/manifest';
import RspHandler from './helpers/rspHandler';
const Glue = require('@hapi/glue');

const GRACEFUL_EXIT_TIMEOUT = 60 * 1000;

process
  .on('SIGINT', () => {
    exitHandler(0);
  })
  .on('SIGTERM', () => {
    exitHandler(0);
  })
  .on('uncaughtException', (err) => {
    console.error('uncaughtException', err);
    exitHandler(1);
  })
  .on('unhandledRejection', (reason, promise) => {
    console.error(
      `Unhandled Rejection at: ${JSON.stringify(promise)} reason: ${reason}`
    );
  });

let server: any;
const init = async() => {
  const options = { relativeTo: __dirname };
  server = await Glue.compose(Manifest.get('/'), options);

  server.ext('onPreResponse', async (request: any, h: any) => {
    const url = request.url.toString();
    const pattens = new RegExp(Config.ignorePathPatterns.join('|'));

    if (!pattens.test(url)) {
      await RspHandler.transform(request);
    }

    return h.continue;
  });

  await server.start();

  console.log(`Server started on port ${Manifest.get('/server/port')}`);
};

const exitHandler = (exitCode: any) => {
  if (server) {
    server.stop({ timeout: GRACEFUL_EXIT_TIMEOUT }, () => {
      console.log(`Disconnecting server in ${GRACEFUL_EXIT_TIMEOUT} seconds...`);
    });
  }
  console.log(`Server Stopped...`);

  console.log(`Process Exited...`);
  process.exit(exitCode);
};

init();

export default server;
export const logError = console.error;
