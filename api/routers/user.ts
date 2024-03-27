import express from "express";
import User from "../models/User";
import mongoose from "mongoose";
import auth, {RequestWithUser} from '../middleware/auth';
import {imagesUpload} from '../multer';
import crypto from 'crypto';
import config from '../config';
import { OAuth2Client } from 'google-auth-library';

const userRouter = express.Router();
const client = new OAuth2Client(config.google.clientId);

userRouter.post('/', imagesUpload.single('avatar'), async (req, res, next) =>{
  try {
    const user = new User ({
      email: req.body.email,
      password: req.body.password,
      displayName: req.body.displayName,
      avatar: req.file ? req.file.filename : null,
    });

    user.generateToken();
    await user.save();
    return res.send({message: "Ok", user});
  }catch (e){
    if (e instanceof mongoose.Error.ValidationError) {
      return res.status(422).send(e);
    }
    next(e);
  }
});

userRouter.post('/sessions', async (req, res, next) =>{
  try {

    const user = await User.findOne({ email: req.body.email});

    if(!user){
      return res.status(422).send({error: 'User not found!'});
    }

    const isMatch = await user.checkPassword(req.body.password);

    if(!isMatch){
      return res.status(422).send({error: 'Password is wrong!'});
    }

    user.generateToken();
    await user.save();
    return res.send({message: 'email and password are correct!', user});
  }catch (e){
    next(e);
  }
});

userRouter.post('/google', async (req, res, next) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: req.body.credential,
      audience: config.google.clientId,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(400).send({ error: 'Google login error!' });
    }

    const email = payload['email'];
    const id = payload['sub'];
    const displayName = payload['name'];

    if (!email) {
      return res.status(400).send({ error: 'Email is not present' });
    }

    let user = await User.findOne({ googleID: id });

    if (!user) {
      user = new User({
        email,
        password: crypto.randomUUID(),
        googleID: id,
        displayName,
      });
    }

    user.generateToken();

    await user.save();

    return res.send({ message: 'Login with Google successful!', user });
  } catch (e) {
    return next(e);
  }
});
userRouter.get('/secret', auth, async (req: RequestWithUser, res, next) =>{
  try {

    return res.send({message: 'This is a secret message!', email: req.user?.email});

  }catch (e){
    next(e);
  }
});

userRouter.delete('/sessions', async (req, res, next) => {
  try {
    const headerValue = req.get('Authorization');
    const successMessage = { message: 'Success!' };

    if (!headerValue) {
      return res.send({ ...successMessage, stage: 'No header' });
    }

    const [_bearer, token] = headerValue.split(' ');

    if (!token) {
      return res.send({ ...successMessage, stage: 'No token' });
    }

    const user = await User.findOne({ token });

    if (!user) {
      return res.send({ ...successMessage, stage: 'No user' });
    }

    user.generateToken();
    await user.save();

    return res.send({ ...successMessage, stage: 'Success' });
  } catch (e) {
    return next(e);
  }
});


export default userRouter;