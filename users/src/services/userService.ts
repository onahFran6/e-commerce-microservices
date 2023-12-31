/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FormatData,
  GenerateHashedPassword,
  GenerateUserToken,
  ValidatePassword,
} from "../util";
import UserRepository from "../database/repository/user.repository";
import {
  AddressDoc,
  CreateUserInputType,
  LoginAndsignupUserReturnType,
  LoginUserInputType,
  OrdersType,
  UserDoc,
  WishListType,
  createAddressInputType,
} from "../types/userType";

class UserService {
  private repository: UserRepository;
  static mockClear: any;

  constructor() {
    this.repository = new UserRepository();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async SignUpUser(
    userInputs: CreateUserInputType
  ): Promise<LoginAndsignupUserReturnType> {
    const { email, password, username, phoneNumber } = userInputs;

    //check if user already exists
    const isUserAlreadyExist = await this.repository.FindUserByEmail({ email });

    if (isUserAlreadyExist) {
      throw new Error("user already exists");
    }
    // create hash password
    const hashedPassword = await GenerateHashedPassword({ password });

    const newUser = await this.repository.CreateUser({
      email,
      password: hashedPassword,
      username,
      phoneNumber,
    });

    const payload = {
      id: newUser._id,
    };
    const token = await GenerateUserToken({
      payload,
    });

    return FormatData({ id: newUser._id, token: token });
  }

  async LoginUser(
    userInputs: LoginUserInputType
  ): Promise<LoginAndsignupUserReturnType> {
    const { email, password } = userInputs;
    //find user by email
    const newUser = await this.repository.FindUserByEmail({
      email,
    });

    if (newUser === null) {
      throw new Error("Invalid email or password");
    }

    //compare password
    const isValidated = await ValidatePassword({
      password,
      existingPassword: newUser.password,
    });

    if (!isValidated) {
      throw new Error("Invalid user email or password");
    }

    const payload = {
      id: newUser._id,
    };

    const token = await GenerateUserToken({
      payload,
    });

    return FormatData({ id: newUser._id, token });
  }

  async AddNewAddressToUser({
    userId,
    street,
    postalCode,
    city,
    country,
  }: createAddressInputType): Promise<Partial<UserDoc>> {
    const user = await this.repository.CreateAddress({
      userId,
      street,
      postalCode,
      city,
      country,
    });
    return FormatData(user);
  }

  async GetUserDetails({
    userId,
  }: {
    userId: string;
  }): Promise<Partial<UserDoc>> {
    const existingUser = await this.repository.FindUserById({ userId });
    return FormatData(existingUser);
  }

  async GetUserWishList({
    userId,
  }: {
    userId: string;
  }): Promise<WishListType[]> {
    const wishListItems = await this.repository.WishList({ userId });
    return FormatData(wishListItems);
  }

  async AddWishListItem({
    userId,
    product,
  }: {
    userId: string;
    product: WishListType;
  }): Promise<WishListType[]> {
    const wishlistResult = await this.repository.AddWishListItem({
      userId,
      product,
    });
    return FormatData(wishlistResult);
  }

  async ManageCartItem({
    userId,
    product,
    qty,
    isRemove,
  }: {
    userId: string;
    product: WishListType;
    qty: number;
    isRemove: boolean;
  }): Promise<Partial<UserDoc>> {
    const cartResult = await this.repository.AddCartItem({
      userId,
      product,
      qty,
      isRemove,
    });
    return FormatData(cartResult);
  }

  async ManageOrder({
    userId,
    order,
  }: {
    userId: string;
    order: OrdersType;
  }): Promise<Partial<UserDoc>> {
    const orderResult = await this.repository.AddOrderToUser({ userId, order });
    return FormatData(orderResult);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async SubscribeEvents(payload: any): Promise<void> {
    const dat = JSON.parse(payload);
    console.log("Triggering.... Customer Events");

    const { event, data } = dat.data;

    console.log("place order", data);

    const { userId, product, order, qty } = data;

    switch (event) {
      case "ADD_TO_WISHLIST":
      case "REMOVE_FROM_WISHLIST":
        this.AddWishListItem({ userId, product });
        break;
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
      case "CREATE_ORDER":
        this.ManageOrder({
          userId,
          order,
        });
        break;
      default:
        break;
    }
  }
}

export default UserService;
