import { Request, Response } from "express";
import UserService from "../services/userService";

class UserController {
  service: UserService;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static mockClear: any;

  constructor() {
    this.service = new UserService();
    this.SignUp = this.SignUp.bind(this);
    this.Login = this.Login.bind(this);
  }

  public async SignUp(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, username } = req.body;
      const data = await this.service.SignUpUser({ email, password, username });
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
}

export default UserController;
