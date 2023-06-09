/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt from "jsonwebtoken";
import config from "../config";
import { ReqUserType } from "index";
import { Connection, Channel, connect } from "amqplib";
// import { LoginAndsignupUserReturnType, UserDoc } from "userType";

const JWT_SECRET = config.JWT_SECRET_KEY;
const MSG_QUEUE_URL = config.MSG_QUEUE_URL;
const EXCHANGE_NAME = config.RABBITMQ_EXCHANGE_NAME;
const SHOPPING_SERVICE = config.SHOPPING_SERVICE;

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export const FormatData = (data: any): any => {
  if (data) {
    return { data };
  } else {
    throw new Error("Data Not found!");
  }
};

export const verifyAuthorizationToken = async ({
  req,
}: {
  req: ReqUserType;
}): Promise<boolean> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    // console.log(authHeader);

    if (token) {
      const payload = jwt.verify(token, JWT_SECRET);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      req.payload = payload;
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const createChannel = async (): Promise<Channel> => {
  // eslint-disable-next-line no-useless-catch
  try {
    const connection: Connection = await connect(MSG_QUEUE_URL);
    const channel: Channel = await connection.createChannel();
    await channel.assertQueue(EXCHANGE_NAME);
    return channel;
  } catch (err) {
    throw err;
  }
};

export const publishMessage = ({
  channel,
  service,
  msg,
}: {
  channel: Channel;
  service: string;
  msg: string;
}): void => {
  channel.publish(EXCHANGE_NAME, service, Buffer.from(msg));
  console.log("Message is Sent: ", msg);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export const subscribeMessage = async ({
  channel,
  service,
}: {
  channel: Channel;
  service: any;
}): Promise<void> => {
  await channel.assertExchange(EXCHANGE_NAME, "direct", { durable: true });
  const q = await channel.assertQueue("", { exclusive: true });
  console.log(` Waiting for messages in queue: ${q.queue}`);

  channel.bindQueue(q.queue, EXCHANGE_NAME, SHOPPING_SERVICE);

  channel.consume(
    q.queue,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (msg: any | null) => {
      if (msg && msg.content) {
        console.log("the message is:", msg.content.toString());
        service.SubscribeEvents(msg.content.toString());
      }
      console.log("[X] received");
    },
    {
      noAck: true,
    }
  );
};
