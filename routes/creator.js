import express from "express";
import { validator } from "../middlewares/validator.js";
import {
  createCreator,
  deleteCreator,
  getCreatorById,
  updateCreator,
} from "../controllers/creator.js";
import { createUserValidation } from "../config/validate/creator.js";
import authUser from "../middlewares/authUser.js";

const creatorRouter = express.Router();

creatorRouter.post(
  "/add-creator/:id",
  validator([createUserValidation]),
  authUser,
  createCreator
);
creatorRouter.get("/get-creators/:id", authUser, getCreatorById);

creatorRouter.patch("/update-creator/:id", authUser, updateCreator);
creatorRouter.delete("/delete-creator/:id", authUser, deleteCreator);

export default creatorRouter;
