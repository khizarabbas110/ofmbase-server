import express from "express";
import { validator } from "../middlewares/validator.js";
import authUser from "../middlewares/authUser.js";
import { createRoleValidation } from "../config/validate/role.js";
import {
  createOrUpdateRole,
  deleteRole,
  getRolesByOwnerId,
  getRolesOfAnAgency,
} from "../controllers/role.js";

const roleRouter = express.Router();

roleRouter.post(
  "/add-role/:id",
  validator([createRoleValidation]),
  authUser,
  createOrUpdateRole
);

roleRouter.get("/get-role/:id", authUser, getRolesByOwnerId);
roleRouter.get("/get-all-roles/:ownerId", authUser, getRolesOfAnAgency);

roleRouter.delete("/delete-role/:roleId", deleteRole);

export default roleRouter;
