import { Router } from "express";
import UserController from "../controllers/user.contoller";
import { verifyUser } from "../middleware/verifyUser";

const router = Router();

const userController = new UserController();

router.route("/signup").post(userController.SignUp);
router.route("/login").post(userController.Login);
router
  .route("/add-address")
  .post(verifyUser, userController.AddNewAddressToUser);
router.route("/user-profile").get(verifyUser, userController.GetUserDetails);
router.route("/wishlist").get(verifyUser, userController.GetUserWishList);

export default router;
