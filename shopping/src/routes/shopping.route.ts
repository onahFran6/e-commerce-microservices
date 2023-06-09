import { Router } from "express";
import ShoppingController from "../controllers/shopping.controller";
import { verifyUser } from "../middleware/verifyUser";

const router = Router();

const shoppingController = new ShoppingController();

router.route("/order").post(verifyUser, shoppingController.PlaceOrder);
router.route("/orders").get(verifyUser, shoppingController.GetOrders);
router.route("/cart").get(verifyUser, shoppingController.GetCart);

export default router;
