import { CartDoc, ItemType, OrderDoc, ProductType } from "orderType";
import OrderModel from "../models/orders";
import CartModel from "../models/carts";
import { uuid } from "uuidv4";

class ShoppingRepository {
  public async getOrdersByUserId({
    userId,
  }: {
    userId: string;
  }): Promise<Partial<OrderDoc[]>> {
    const orders: OrderDoc[] = await OrderModel.find({ userId });
    return orders;
  }

  public async getOrdersByUserOrderId({
    orderId,
  }: {
    orderId: string;
  }): Promise<Partial<OrderDoc>> {
    const orders: OrderDoc = await OrderModel.findOne({ orderId });
    return orders;
  }

  public async getCartItems({
    userId,
  }: {
    userId: string;
  }): Promise<ItemType[]> {
    const cartItems: ItemType[] = await CartModel.find({ userId });

    if (cartItems) {
      return cartItems;
    }
    throw new Error("Data not found!");
  }

  public async addCartItem({
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
    const cart = await CartModel.findOne({ userId });

    console.log("Cart", cart);

    const { _id } = product;

    if (cart) {
      console.log("Cart yes", cart);
      let isExist = false;
      const cartItems: ItemType[] = cart.items;

      if (cartItems.length > 0) {
        cartItems.map((item: ItemType) => {
          if (item.product._id.toString() === _id.toString()) {
            if (isRemove) {
              cartItems.splice(cartItems.indexOf(item), 1);
            } else {
              item.unit = qty;
            }
            isExist = true;
          }
        });
      }

      if (!isExist && !isRemove) {
        cartItems.push({ product: { ...product }, unit: qty });
      }

      cart.items = cartItems;

      return await cart.save();
    } else {
      console.log("Cart No", cart);
      return await CartModel.create({
        userId,
        items: [{ product: { ...product }, unit: qty }],
      });
    }
  }

  public async createNewOrder({
    userId,
  }: {
    userId: string;
  }): Promise<OrderDoc> {
    const cart = await CartModel.findOne({ userId });

    if (cart) {
      let amount = 0;
      const cartItems: ItemType[] = cart.items;

      if (cartItems.length > 0) {
        cartItems.map((item) => {
          amount += item.product.price * item.unit;
        });

        const orderId = uuid();

        const order = new OrderModel({
          orderId,
          userId,
          amount,
          status: "received",
          items: cartItems,
        });

        cart.items = [];

        const orderResult = await order.save();
        await cart.save();
        return orderResult;
      }
    }

    return {} as OrderDoc;
  }
}

export default ShoppingRepository;
