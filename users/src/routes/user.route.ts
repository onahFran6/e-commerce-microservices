import { Router } from "express";
import UserController from "../controllers/user.contoller";

const router = Router();

const userController = new UserController();

router.route("/signup").post(userController.SignUp);
router.route("/login").post(userController.Login);

export default router;
