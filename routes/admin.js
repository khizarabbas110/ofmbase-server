import express from 'express';
import { addUserByAdmin, deleteUser, fetchAllUsers } from '../controllers/admin.js';
const adminRouter = express.Router();


adminRouter.get("/fetch-all-users", fetchAllUsers);
adminRouter.delete("/delete-user/:id", deleteUser);
adminRouter.post("/add-user-by-admin", addUserByAdmin);


export default adminRouter;