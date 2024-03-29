import express from "express";
import role, {RequestWithUser} from "../middleware/role";
import Cocktail from "../models/Cocktails";
import {imagesUpload} from "../multer";
import auth from "../middleware/auth";
import * as fs from "fs";
import mongoose, {HydratedDocument} from "mongoose";
import permit from "../middleware/permit";
import {Cocktails} from "../types";

const cocktailRouter = express.Router();

cocktailRouter.get('/', role, async (req, res, next) => {
  try {
    const user = (req as RequestWithUser).user;
    const queryUser = req.query.user as string;
    let cocktails;
    if (queryUser) {
      cocktails = await Cocktail.find({author: queryUser});
    } else if (user && user.role === "admin") {
      cocktails = await Cocktail.find();
    } else {
      cocktails = await Cocktail.find({ isPublished: true });
    }
    return res.send(cocktails);
  } catch(e) {
    return next(e);
  }
});

cocktailRouter.get('/:id', role, async (req, res, next) => {
  try {
    const response = await Cocktail.find({_id: req.params.id});
    return res.send(response);
  } catch {
    return res.sendStatus(500);
  }
});

cocktailRouter.post('/',
  auth,
  imagesUpload.single('image'),
  async (req, res, next) => {
    const user = (req as RequestWithUser).user;
    try {
      const cocktail = await Cocktail.create({
        author: user._id,
        name: req.body.name,
        receipt: req.body.receipt,
        image: req.file ? req.file.filename : null,
        ingredients: JSON.parse(req.body.ingredients),
      });
      return res.send(cocktail);
    } catch (e) {
      if (e instanceof mongoose.Error.ValidationError) {
        return res.status(422).send(e);
      }
      next(e);
    }
  });

cocktailRouter.patch(
  "/:id/isPublished",
  auth,
  permit("admin"),
  async (req, res, next) => {
    const cocktail: HydratedDocument<Cocktails> | null = await Cocktail.findById(
      req.params.id
    );
    if (!cocktail) {
      return res.sendStatus(404);
    }
    cocktail.isPublished = !cocktail.isPublished;
    try {
      await cocktail.save();
      return res.send(cocktail);
    } catch(e) {
      return next(e);
    }
  }
);

cocktailRouter.delete("/:id", auth, async (req, res, next) => {
  const user = (req as RequestWithUser).user;
  try {
    let deleted;
    if (user.role === "admin") {
      deleted = await Cocktail.deleteOne({_id: req.params.id});
    } else {
      deleted = await Cocktail.deleteOne({
        _id: req.params.id,
        author: user._id,
        isPublished: false,
      });
    }
    if (deleted.deletedCount === 1) {
      return res.send({message: "deleted"});
    } else {
      res.status(404).send({message: "cant delete"});
    }
  } catch(e) {
    return next(e);
  }
});

export default cocktailRouter;