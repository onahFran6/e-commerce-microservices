import { Response } from "express";
import ProductService from "../services/productService";
import { ReqUserType } from "index";
import { createChannel, publishMessage } from "../util/index";
import { Channel } from "amqplib";
import config from "../config";

class ProductController {
  service: ProductService;
  channel: Channel;
  USER_SERVICE: string;
  SHOPPING_SERVICE: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static mockClear: any;

  constructor() {
    this.service = new ProductService();
    this.CreateProduct = this.CreateProduct.bind(this);
    this.GetProducts = this.GetProducts.bind(this);
    this.GetProductsByCategory = this.GetProductsByCategory.bind(this);
    this.GetProductDescription = this.GetProductDescription.bind(this);
    this.AddToWishList = this.AddToWishList.bind(this);
    this.RemoveFromWishList = this.RemoveFromWishList.bind(this);
    this.AddToCart = this.AddToCart.bind(this);
    this.RemoveFromCart = this.RemoveFromCart.bind(this);
    this.USER_SERVICE = config.USER_SERVICE;
    this.SHOPPING_SERVICE = config.SHOPPING_SERVICE;
    this.initChannel();
  }

  async initChannel(): Promise<void> {
    try {
      this.channel = await createChannel();
    } catch (error) {
      console.error("Failed to create channel:", error);
    }
  }

  public async CreateProduct(req: ReqUserType, res: Response): Promise<void> {
    try {
      const { name, desc, type, unit, price, available, suplier, banner } =
        req.body;
      const data = await this.service.CreateProduct({
        name,
        desc,
        type,
        unit,
        price,
        available,
        suplier,
        banner,
      });
      res.status(200).json(data);
    } catch (error) {
      // console.log("======>>>>> Error", error);
      res.status(400).json({ error: error.message });
    }
  }

  public async GetProducts(req: ReqUserType, res: Response): Promise<void> {
    try {
      const data = await this.service.GetProducts();
      res.status(200).json(data);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  public async GetProductDescription(
    req: ReqUserType,
    res: Response
  ): Promise<void> {
    try {
      const productId = req.params.productId;

      const data = await this.service.GetProductDescription({
        productId,
      });

      res.status(200).json(data);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  public async GetProductsByCategory(
    req: ReqUserType,
    res: Response
  ): Promise<void> {
    try {
      const typeOfProduct = req.params.typeOfProduct;

      const data = await this.service.GetProductsByCategory({ typeOfProduct });

      res.status(200).json(data);
    } catch (error) {
      console.log("error", error);
      res.status(400).json({ error: error.message });
    }
  }

  public async AddToWishList(req: ReqUserType, res: Response): Promise<void> {
    try {
      const { id: userId } = req.payload;

      const { productId } = req.body;
      const productInfo = {
        productId: productId,
      };

      const data = await this.service.GetProductPayload({
        userId,
        productInfo,
        eventType: "ADD_TO_WISHLIST",
      });

      // PublishCustomerEvent(data);
      publishMessage({
        channel: this.channel,
        service: this.USER_SERVICE,
        msg: JSON.stringify(data),
      });

      res.status(200).json(data);
    } catch (error) {
      console.log("error", error);
      res.status(400).json({ error: error.message });
    }
  }

  public async RemoveFromWishList(
    req: ReqUserType,
    res: Response
  ): Promise<void> {
    try {
      const { id: userId } = req.payload;

      const productId = req.params.productId;
      const productInfo = {
        productId: productId,
      };

      const data = await this.service.GetProductPayload({
        userId,
        productInfo,
        eventType: "REMOVE_TO_WISHLIST",
      });

      // PublishCustomerEvent(data);
      publishMessage({
        channel: this.channel,
        service: this.USER_SERVICE,
        msg: JSON.stringify(data),
      });

      res.status(200).json(data);
    } catch (error) {
      console.log("error", error);
      res.status(400).json({ error: error.message });
    }
  }

  public async AddToCart(req: ReqUserType, res: Response): Promise<void> {
    try {
      const { id: userId } = req.payload;

      const { productId, qty } = req.body;
      const productInfo = {
        productId: productId,
        qty: qty,
      };

      const data = await this.service.GetProductPayload({
        userId,
        productInfo,
        eventType: "ADD_TO_CART",
      });

      // PublishCustomerEvent(data);
      publishMessage({
        channel: this.channel,
        service: this.USER_SERVICE,
        msg: JSON.stringify(data),
      });
      publishMessage({
        channel: this.channel,
        service: this.SHOPPING_SERVICE,
        msg: JSON.stringify(data),
      });

      const response = { product: data.data.product, unit: data.data.qty };

      res.status(200).json(response);
    } catch (error) {
      console.log("error", error);
      res.status(400).json({ error: error.message });
    }
  }

  public async RemoveFromCart(req: ReqUserType, res: Response): Promise<void> {
    try {
      const { id: userId } = req.payload;

      const productId = req.params.productId;
      const productInfo = {
        productId: productId,
      };

      const data = await this.service.GetProductPayload({
        userId,
        productInfo,
        eventType: "REMOVE_FROM_CART",
      });

      // PublishCustomerEvent(data);
      publishMessage({
        channel: this.channel,
        service: this.USER_SERVICE,
        msg: JSON.stringify(data),
      });
      publishMessage({
        channel: this.channel,
        service: this.SHOPPING_SERVICE,
        msg: JSON.stringify(data),
      });

      const response = { product: data.data.product, unit: data.data.qty };

      res.status(200).json(response);
    } catch (error) {
      console.log("error", error);
      res.status(400).json({ error: error.message });
    }
  }
}

export default ProductController;
