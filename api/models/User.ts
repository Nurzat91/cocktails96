import mongoose, {HydratedDocument} from 'mongoose';
import bcrypt from 'bcrypt';
import {randomUUID} from "crypto";

import {UserFields, UserMethods, UserModel} from "../types";


const SALT_WORK_FACTOR = 15;

const Schema = mongoose.Schema;

const UserSchema = new Schema<UserFields, UserModel, UserMethods>({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: async function (this:HydratedDocument<UserFields>, value: string): Promise<boolean> {
        if(!this.isModified('email')) return true;

        const user: HydratedDocument<UserFields> | null = await User.findOne({email: value});

        return !user;
      },
      message: 'This email is already registered'
    }
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['client', 'admin'],
    default: 'client',
  },
  displayName: {
    type: String,
    required: true,
  },
  googleID: String,
  avatar: {
    type: String,
    required: true,
  },
});

UserSchema.methods.checkPassword = function (password: string) {
  return bcrypt.compare(password, this.password);
};

UserSchema.methods.generateToken = function (){
  this.token = randomUUID();
};

UserSchema.pre('save', async function(next) {
  console.log('i am about to save', this.email, this.password);

  if(!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

UserSchema.set('toJSON', {
  transform: (doc, ret, options) =>{
    delete ret.password;
    return ret;
  }
});
const User = mongoose.model<UserFields, UserModel>('User', UserSchema);
export default User;