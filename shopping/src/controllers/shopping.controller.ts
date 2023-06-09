import { Response } from "express";
import ShoppingService from "../services/shoppingService";
import { ReqUserType } from "index";
import { createChannel, publishMessage, subscribeMessage } from "../util/index";
import { Channel } from "amqplib";
import config from "../config";

class ProductController {
  service: ShoppingService;
  channel: Channel;
  USER_SERVICE: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any

  constructor() {
    this.service = new ShoppingService();
    this.PlaceOrder = this.PlaceOrder.bind(this);
    this.GetOrders = this.GetOrders.bind(this);
    this.GetCart = this.GetCart.bind(this);
    this.USER_SERVICE = config.USER_SERVICE;
    this.initChannel();
  }

  async initChannel(): Promise<void> {
    try {
      this.channel = await createChannel();
      if (this.channel) {
        subscribeMessage({ channel: this.channel, service: this.service });
      }
    } catch (error) {
      console.error("Failed to create channel:", error);
    }
  }

  public async PlaceOrder(req: ReqUserType, res: Response): Promise<void> {
    try {
      const { id: userId } = req.payload;

      const { data } = await this.service.PlaceOrder({
        userId,
      });

      console.log("Place order", data);
      const payload = await this.service.GetOrderPayload({
        userId,
        order: data,
        event: "CREATE_ORDER",
      });

      console.log("Place order payload", payload);
      publishMessage({
        channel: this.channel,
        service: this.USER_SERVICE,
        msg: JSON.stringify(payload),
      });

      res.status(200).json(data);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  public async GetOrders(req: ReqUserType, res: Response): Promise<void> {
    try {
      const { id: userId } = req.payload;

      const data = await this.service.GetOrders({
        userId,
      });

      res.status(200).json(data);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  public async GetCart(req: ReqUserType, res: Response): Promise<void> {
    try {
      const { id: userId } = req.payload;

      const data = await this.service.GetCartByUserId({
        userId,
      });

      res.status(200).json(data);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default ProductController;
