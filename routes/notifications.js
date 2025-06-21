import express from "express";
import { getNotificationsById } from "../controllers/notifications.js";

const notificationsRouter = express.Router();

notificationsRouter.get("/get-notifications/:id", getNotificationsById);

export default notificationsRouter;
