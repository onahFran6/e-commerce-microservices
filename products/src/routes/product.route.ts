import { Router } from "express";
import ProductController from "../controllers/product.controller";
import { verifyUser } from "../middleware/verifyUser";

const router = Router();

const productController = new ProductController();

router
  .route("/create-product")
  .post(verifyUser, productController.CreateProduct);
router
  .route("/category/:typeOfProduct")
  .get(verifyUser, productController.GetProductsByCategory);
router
  .route("/:productId")
  .get(verifyUser, productController.GetProductDescription);
router.route("/wishlists").put(verifyUser, productController.AddToWishList);
router
  .route("/wishlist/:productId")
  .delete(verifyUser, productController.RemoveFromWishList);
router.route("/cart").put(verifyUser, productController.AddToCart);
router
  .route("/cart/:productId")
  .delete(verifyUser, productController.RemoveFromCart);

export default router;
