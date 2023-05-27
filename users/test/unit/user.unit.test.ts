/* eslint-disable @typescript-eslint/no-unused-vars */
import UserController from "../../src/controllers/user.contoller";
import UserService from "../../src/services/userService";
import UserRepository from "../../src/database/repository/user.repository";
import {
  CreateUserInputType,
  LoginUserInputType,
} from "../../src/types/userType";
import {
  GenerateHashedPassword,
  ValidatePassword,
  GenerateUserToken,
  FormatData,
} from "../../src/util";

jest.mock("../../src/database/repository/user.repository");
jest.mock("../../src/util", () => ({
  GenerateHashedPassword: jest.fn(),
  ValidatePassword: jest.fn(),
  GenerateUserToken: jest.fn(),
  FormatData: jest.fn(),
}));

describe("UserService ==>  unit test on the UserService.Signup method", () => {
  let userService: UserService;
  let userRepositoryMock: jest.Mocked<UserRepository>;

  const createMockUserRepository = () => {
    const userRepository = new UserRepository() as jest.Mocked<UserRepository>;
    userRepository.CreateUser.mockResolvedValue({ _id: "123" });
    userRepository.FindUserByEmail.mockResolvedValue({ _id: "123" });
    return userRepository;
  };

  beforeEach(() => {
    userRepositoryMock = createMockUserRepository();
    userService = new UserService();
    userService["repository"] = userRepositoryMock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new user and return formatted data", async () => {
    const userInputs: CreateUserInputType = {
      email: "test@example.com",
      password: "password",
      username: "testuser",
    };
    userRepositoryMock.FindUserByEmail.mockResolvedValue(null);
    (GenerateHashedPassword as jest.Mock).mockResolvedValue("hashedPassword");
    (GenerateUserToken as jest.Mock).mockReturnValue("token");
    (FormatData as jest.Mock).mockReturnValue({
      id: "123",
      token: "token",
    });

    const result = await userService.SignUpUser(userInputs);

    expect(userRepositoryMock.FindUserByEmail).toHaveBeenCalledTimes(1);
    expect(userRepositoryMock.CreateUser).toHaveBeenCalledWith({
      ...userInputs,
      password: "hashedPassword",
    });
    expect(result.id).toBe("123");
    expect(result.token).toBeDefined();
  });

  it("should throw an error if user already exists", async () => {
    const userInputs: CreateUserInputType = {
      email: "test@example.com",
      password: "password",
      username: "testuser",
    };

    await expect(userService.SignUpUser(userInputs)).rejects.toThrowError(
      "user already exists"
    );
    expect(userRepositoryMock.FindUserByEmail).toHaveBeenCalledTimes(1);
    expect(userRepositoryMock.FindUserByEmail).toHaveBeenCalledWith({
      email: userInputs.email,
    });
    expect(userRepositoryMock.CreateUser).not.toHaveBeenCalled();
  });
});

describe("UserService ==>  unit test on the UserService.Login method", () => {
  let userService: UserService;
  let userRepositoryMock: jest.Mocked<UserRepository>;

  const createMockUserRepository = () => {
    const userRepository = new UserRepository() as jest.Mocked<UserRepository>;
    userRepository.FindUserByEmail.mockResolvedValue({ _id: "123" });
    userRepository.FindIfUserAlreadyExistByEmail.mockResolvedValue(false);
    userRepository.FindUserById.mockResolvedValue({ _id: "123" });
    return userRepository;
  };

  beforeEach(() => {
    userRepositoryMock = createMockUserRepository();
    userService = new UserService();
    userService["repository"] = userRepositoryMock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should login a user and return formatted data", async () => {
    const userInputs: LoginUserInputType = {
      email: "test@example.com",
      password: "password",
    };
    (ValidatePassword as jest.Mock).mockResolvedValue(true);
    (GenerateUserToken as jest.Mock).mockReturnValue("token");
    (FormatData as jest.Mock).mockReturnValue({
      id: "123",
      token: "token",
    });

    const result = await userService.LoginUser(userInputs);

    expect(userRepositoryMock.FindUserByEmail).toHaveBeenCalledTimes(1);
    expect(GenerateUserToken).toHaveBeenCalledWith({
      payload: {
        id: "123",
      },
    });
    expect(result.id).toBe("123");
    expect(result.token).toBeDefined();
  });

  it("should throw an error if user email does not exists", async () => {
    const userInputs: LoginUserInputType = {
      email: "test@example.com",
      password: "password",
    };

    (ValidatePassword as jest.Mock).mockResolvedValue(true);
    (userRepositoryMock.FindUserByEmail as jest.Mock).mockResolvedValue(null);

    // assertion
    await expect(userService.LoginUser(userInputs)).rejects.toThrowError(
      "Invalid email or password"
    );
    expect(userRepositoryMock.FindUserByEmail).toHaveBeenCalledTimes(1);
    expect(userRepositoryMock.FindUserByEmail).toHaveBeenCalledWith({
      email: userInputs.email,
    });
    expect(ValidatePassword).not.toHaveBeenCalled();
  });

  it("should throw an error if user password does not match", async () => {
    const userInputs: LoginUserInputType = {
      email: "test@example.com",
      password: "password",
    };

    (ValidatePassword as jest.Mock).mockResolvedValue(false);
    (FormatData as jest.Mock).mockReturnValue({
      id: "123",
      token: "token",
    });

    // assertion
    await expect(userService.LoginUser(userInputs)).rejects.toThrowError(
      "Invalid user email or password"
    );
    expect(userRepositoryMock.FindUserByEmail).toHaveBeenCalledTimes(1);
    expect(userRepositoryMock.FindUserByEmail).toHaveBeenCalledWith({
      email: userInputs.email,
    });
    expect(ValidatePassword).toHaveBeenCalled();
    expect(FormatData).not.toHaveBeenCalled();
  });
});
