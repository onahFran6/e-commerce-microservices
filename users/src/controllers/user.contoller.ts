import { Request, Response } from "express";
import UserService from "../services/userService";
import { ReqUserType } from "index";
import { createChannel, subscribeMessage } from "../util/index";
import { Channel } from "amqplib";

class UserController {
  service: UserService;
  channel: Channel;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static mockClear: any;

  constructor() {
    this.service = new UserService();
    this.initChannel();
    this.SignUp = this.SignUp.bind(this);
    this.Login = this.Login.bind(this);
    this.AddNewAddressToUser = this.AddNewAddressToUser.bind(this);
    this.GetUserDetails = this.GetUserDetails.bind(this);
    this.GetUserWishList = this.GetUserWishList.bind(this);
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

  public async SignUp(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, username, phoneNumber } = req.body;
      const data = await this.service.SignUpUser({
        email,
        password,
        username,
        phoneNumber,
      });
      res.status(200).json(data);
    } catch (error) {
      // console.log("======>>>>> Error", error);
      res.status(400).json({ error: error.message });
    }
  }

  public async Login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const data = await this.service.LoginUser({ email, password });
      res.status(200).json(data);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  public async AddNewAddressToUser(
    req: ReqUserType,
    res: Response
  ): Promise<void> {
    try {
      const { id: userId } = req.payload;

      const { street, postalCode, city, country } = req.body;

      const data = await this.service.AddNewAddressToUser({
        userId,
        street,
        postalCode,
        city,
        country,
      });

      res.status(200).json(data);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  public async GetUserDetails(req: ReqUserType, res: Response): Promise<void> {
    try {
      const { id: userId } = req.payload;

      const data = await this.service.GetUserDetails({ userId });

      res.status(200).json(data);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  public async GetUserWishList(req: ReqUserType, res: Response): Promise<void> {
    try {
      const { id: userId } = req.payload;

      const data = await this.service.GetUserWishList({
        userId,
      });

      res.status(200).json(data);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  public async test(req: ReqUserType, res: Response): Promise<void> {
    try {
      const { id: userId } = req.payload;

      const { street, postalCode, city, country } = req.body;

      const data = await this.service.AddNewAddressToUser({
        userId,
        street,
        postalCode,
        city,
        country,
      });

      res.status(200).json(data);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default UserController;
