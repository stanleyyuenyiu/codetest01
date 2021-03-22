'use strict';

import { Schema } from 'mongoose';

const UserEntity = new Schema(
  {
    userName: { type: String, trim: true, default: '' },
    age: { type: Number, trim: true, default: '' },
    height: { type: Number, trim: true, default: '' },
    gender: { type: String, enum: ['f', 'M'], default: 'f' },
    saleAmount: { type: Number, trim: true, default: '' },
    lastPurchaseDate: { type: Date, default: Date.now },
  },
  { strict: true }
);

export default UserEntity;
