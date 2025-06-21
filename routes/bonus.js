import express from "express";
import { createBonus, deleteBonus, getAllBonuses, updateBonus } from "../controllers/bonus.js";
import authUser from "../middlewares/authUser.js";

const bonusRouter = express.Router();

bonusRouter.post("/create-bonus", authUser, createBonus);
bonusRouter.get("/fetch-bonus/:ownerId", authUser, getAllBonuses);
bonusRouter.put("/update-bonus/:id", updateBonus);
bonusRouter.delete("/delete-bonus/:id", deleteBonus);


export default bonusRouter;
