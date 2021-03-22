'use strict';
import * as Hapi from '@hapi/hapi';
import errHandler from '../../helpers/errorHandler';
import { isBlank, fmtData, getDateRange } from '../../helpers/utils';
import { user } from '../../type/user';
import { QueryRequest } from '../../type/general';
import { CsvHeader } from '../../type/constants';
import UserEntity from '../../models/user';
import { BadRequestError, HttpStatusCode } from '../../lib/error';
import moment = require('moment');
import csv = require('csvtojson');
import _ = require('lodash');
export default class UploadController {
  constructor() {}

  public async Request(request: Hapi.Request, h: Hapi.ResponseToolkit) {
    const payload: any = request.payload;
    const file = payload['data'];
    let bulkWrites: unknown[] = [];
    const requiredErr: number[] = [];
    const fmtErr: number[] = [];
    let index: number = 0;
    try {
      // TODO should split the stream file , push data to queue and use worker
      csv({
        noheader: false,
        headers: [
          CsvHeader.USER_NAME,
          CsvHeader.AGE,
          CsvHeader.HEIGHT,
          CsvHeader.GENDER,
          CsvHeader.SALE_AMOUNT,
          CsvHeader.LAST_PURCHASE_DATE,
        ],
      })
        .fromStream(file)
        .subscribe(
          async (data: user) => {
            index++;
            if (
              isBlank(data.USER_NAME) ||
              isBlank(data.AGE) ||
              isBlank(data.HEIGHT) ||
              isBlank(data.GENDER) ||
              isBlank(data.SALE_AMOUNT) ||
              isBlank(data.LAST_PURCHASE_DATE)
            ) {
              requiredErr.push(index);
              return;
            }
            try {
              const fmt = fmtData(data);
              // TODO should use worker instead, below process may has memory leak
              bulkWrites.push({
                insertOne: {
                  document: fmt,
                },
              });
              if (bulkWrites.length >= 1000) {
                const result = await UserEntity.bulkWrite(bulkWrites);
                bulkWrites = [];
              }
            } catch (e) {
              fmtErr.push(index);
            }
          },
          (e: any) => {},
          async () => {
            if (requiredErr.length > 0) {
              throw new BadRequestError(
                {
                  code: 400,
                  message: `Missing data in rows ${requiredErr.join(',')}`,
                },
                HttpStatusCode.BAD_REQUEST
              );
            }
            if (fmtErr.length > 0) {
              throw new BadRequestError(
                {
                  code: 400,
                  message: `Missing data in rows ${fmtErr.join(',')}`,
                },
                HttpStatusCode.BAD_REQUEST
              );
            }
            if (bulkWrites.length > 0) {
              const result = await UserEntity.bulkWrite(bulkWrites);
            }
          }
        );
      // TODO should send success email after complete
      return h.response({}).code(200);
    } catch (error) {
      return errHandler.handleError(error);
    }
  }

  public async Response(request: QueryRequest, h: Hapi.ResponseToolkit) {
    const { from, to } = request.query;
    // TODO should have paging
    try {
      const r = getDateRange(from, to);
      const query: any = {};

      if (!isBlank(r.from)) {
        query['$gte'] = r.from;
      }
      if (!isBlank(r.to)) {
        query['$lt'] = r.to;
      }
      const result = await UserEntity.find({ lastPurchaseDate: query });
      return h.response({ data: result }).code(200);
    } catch (error) {
      return errHandler.handleError(error);
    }
  }
}
