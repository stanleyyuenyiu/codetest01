'use strict';
import { user } from '../type/user';
import UserEntity from '../models/user';
import { IUserEntity } from '../interface/user-entities';
import { BadRequestError, HttpStatusCode } from '../lib/error';
import _ = require('lodash');
import moment = require('moment');

export const isBlank = (value: any) => {
  return (_.isEmpty(value) && !_.isNumber(value)) || _.isNaN(value);
};

export const fmtData = (data: user): IUserEntity => {
  if (!moment(data.LAST_PURCHASE_DATE).isValid()) {
    throw new Error('Datetime parse error');
  }
  return new UserEntity({
    userName: data.USER_NAME,
    age: data.AGE,
    height: data.HEIGHT,
    gender: data.GENDER,
    saleAmount: data.SALE_AMOUNT,
    lastPurchaseDate: moment.utc(data.LAST_PURCHASE_DATE),
  });
};

export const getDateRange = (
  from?: string,
  to?: string
): { from: moment.Moment | null; to: moment.Moment | null } => {
  if (
    (!isBlank(from) && !moment(new Date(from || 0)).isValid()) ||
    (!isBlank(to) && !moment(new Date(to || 0)).isValid())
  ) {
    throw new BadRequestError(
      { code: 400, message: `Request date range format is not correct` },
      HttpStatusCode.BAD_REQUEST
    );
  }

  const f = moment.utc(new Date(from || 0), 'YYYY-MM-DD');
  const t = moment.utc(new Date(to || 0), 'YYYY-MM-DD');
  if (!isBlank(from) && !isBlank(to)) {
    if (f.diff(t) >= 0) {
      throw new BadRequestError(
        { code: 400, message: `Request date range format is not correct` },
        HttpStatusCode.BAD_REQUEST
      );
    }
  }
  return {
    from: isBlank(from) ? null : f,
    to: isBlank(to) ? null : t.add(1, 'days'),
  };
};
