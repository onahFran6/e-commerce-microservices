import request from "supertest";
import app from "../../src/app";
import mongoose from "mongoose";
import UserModel from "../../src/database/models/users";
import config from "../../src/config";
import { UserDoc } from "../../src/types/userType";
import { GenerateHashedPassword } from "../../src/util";

process.env.NODE_ENV = "test";

const mongoUrl = config.MONGODB_URI;
// let mongoServer: MongoMemoryServer;

describe("Get app /", () => {
  describe("GET / - a simple api endpoint", () => {
    it("Hello API Request", async () => {
      const result = await request(app).get("/");
      expect(result.status).toEqual(200);
    });
  });
});

describe("Signup endpoint /api/v1/user/signup", () => {
  jest.setTimeout(100000);

  const userObject = {
    email: "JohnDoe@email.com",
    username: "JohnD",
    password: "password",
  };

  beforeAll(async () => {
    // Connect to the in-memory database
    await mongoose.connect(mongoUrl);
  });

  afterEach(async () => {
    // Clear the collections after each test
    await UserModel.deleteMany({});
  });

  afterAll(async () => {
    await UserModel.deleteMany({});
    // Disconnect from the MongoDB database

    await mongoose.disconnect();
  });

  it("should create a new user and return a status code of 200", async () => {
    const res = await request(app).post("/api/v1/user/signup").send(userObject);
    expect(res.status).toEqual(200);
    const userId = res.body.data.id;
    const user = await UserModel.findById(userId);
    expect(user).toBeDefined();
  });

  it("should return an error of user already exists and a status code of 400", async () => {
    const user = new UserModel(userObject);
    await user.save();
    const res = await request(app).post("/api/v1/user/signup").send(userObject);
    expect(res.status).toEqual(400);
    expect(res.body.error).toEqual("user already exists");
  });
});

describe("Login endpoint /api/v1/user/login", () => {
  jest.setTimeout(100000);
  let user: UserDoc;

  const userObjectLogin = {
    email: "JohnDoe@email.com",
    password: "password",
  };

  const incorrectEmail = {
    email: "JohnDoewrong@email.com",
    password: "password",
  };

  beforeAll(async () => {
    await mongoose.connect(mongoUrl);
    const hashedPassword = await GenerateHashedPassword({
      password: "password",
    });
    const userObject = {
      email: "JohnDoe@email.com",
      username: "JohnDoe",
      password: hashedPassword,
    };

    user = new UserModel(userObject);
    await user.save();
  });

  afterAll(async () => {
    // Disconnect from the MongoDB database
    await UserModel.deleteMany({});
    await mongoose.disconnect();
  });

  it("should login a user and return a status code of 200", async () => {
    const res = await request(app)
      .post("/api/v1/user/login")
      .send(userObjectLogin);
    expect(res.status).toEqual(200);
    const userId = res.body.data.id;
    expect(userId).toEqual(user._id.toString());
  });

  it("should return an error if the user email does not  exists and a status code of 400", async () => {
    const res = await request(app)
      .post("/api/v1/user/login")
      .send(incorrectEmail);
    expect(res.status).toEqual(400);
    expect(res.body.error).toEqual("Invalid email or password");
  });
});
