import express from "express";
import { validator } from "../middlewares/validator.js";
import authUser from "../middlewares/authUser.js";
import { createTaskValidation } from "../config/validate/tasks.js";
import {
  createTask,
  deleteTask,
  getAgencyTasks,
  updateTask,
} from "../controllers/task.js";

const taskRouter = express.Router();

taskRouter.post(
  "/add-task/:id",
  validator([createTaskValidation]),
  authUser,
  createTask
);

taskRouter.get("/get-tasks/:id", authUser, getAgencyTasks);
taskRouter.patch(
  "/update-task/:id",
  validator([createTaskValidation]),
  authUser,
  updateTask
);
taskRouter.delete("/delete-task/:id", authUser, deleteTask);

export default taskRouter;
