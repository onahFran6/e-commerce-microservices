/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormatData } from "../util";
import ShoppingRepository from "../database/repository/shopping.repository";
import { CartDoc, ItemType, OrderDoc, ProductType } from "orderType";

class ShoppingService {
  private repository: ShoppingRepository;

  constructor() {
    this.repository = new ShoppingRepository();
  }

  async GetCartByUserId({ userId }: { userId: string }): Promise<ItemType[]> {
    const cartItems = await this.repository.getCartItems({ userId });
    return FormatData(cartItems);
  }

  async PlaceOrder({ userId }: { userId: string }): Promise<any> {
    const orderResult = await this.repository.createNewOrder({
      userId,
    });

    return FormatData(orderResult);
  }

  async GetOrders({ userId }: { userId: string }): Promise<OrderDoc[]> {
    const orders = await this.repository.getOrdersByUserId({ userId });
    return FormatData(orders);
  }

  async ManageCartItem({
    userId,
    product,
    qty,
    isRemove,
  }: {
    userId: string;
    product: ProductType;
    qty: number;
    isRemove: boolean;
  }): Promise<CartDoc> {
    const cartResult = await this.repository.addCartItem({
      userId,
      product,
      qty,
      isRemove,
    });
    return FormatData(cartResult);
  }

  async GetOrderPayload({
    userId,
    order,
    event,
  }: {
    userId: string;
    order: Partial<OrderDoc>;
    event: string;
  }): Promise<any> {
    if (order) {
      const payload = {
        event: event,
        data: { userId, order },
      };
      console.log("get order payload", payload);
      return FormatData(payload);
    } else {
      return FormatData({ error: "No Order Available" });
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async SubscribeEvents(payload: any): Promise<void> {
    const dat = JSON.parse(payload);
    console.log("Triggering.... Shopping Events", { payload: dat.data });

    const { event, data } = dat.data;

    const { userId, product, qty } = data;

    switch (event) {
      case "ADD_TO_CART":
        this.ManageCartItem({
          userId,
          product,
          qty,
          isRemove: false,
        });
        break;
      case "REMOVE_FROM_CART":
        this.ManageCartItem({
          userId,
          product,
          qty,
          isRemove: true,
        });
        break;

      default:
        break;
    }
  }
}

export default ShoppingService;
