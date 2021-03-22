'use strict';
import UserSchema from '../models/entities/user';
import { IUserEntity } from '../interface/user-entities';
import { model } from 'mongoose';

export default model<IUserEntity>('User', UserSchema);
