import express from "express";
import { validator } from "../middlewares/validator.js";
import authUser from "../middlewares/authUser.js";
import { createEmployeeValidation } from "../config/validate/employee.js";
import { createEmployee, deleteEmployee, getAgencyEmployees, updateEmployee } from "../controllers/employee.js";

const employeeRouter = express.Router();

employeeRouter.post(
  "/add-employee/:id",
  validator([createEmployeeValidation]),
  authUser,
  createEmployee
);
employeeRouter.get("/get-employee/:id", authUser, getAgencyEmployees);
employeeRouter.patch("/update-employee/:id", authUser, updateEmployee);
employeeRouter.delete("/delete-employee/:id", authUser, deleteEmployee);

export default employeeRouter;
