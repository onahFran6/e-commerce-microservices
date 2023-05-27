/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FormatData,
  GenerateHashedPassword,
  GenerateUserToken,
  ValidatePassword,
} from "../util";
import UserRepository from "../database/repository/user.repository";
import {
  CreateUserInputType,
  LoginAndsignupUserReturnType,
  LoginUserInputType,
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
    const { email, password, username } = userInputs;

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
}

export default UserService;
