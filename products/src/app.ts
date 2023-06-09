import express, { Request, Response } from "express";
import compression from "compression"; // compresses requests
import lusca from "lusca";
import path from "path";
import cors from "cors";
import helmet from "helmet";

import productRouter from "./routes/product.route";

// Create Express server
const app = express();

// Express configuration
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");
app.use(compression());
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));

app.use(
  express.static(path.join(__dirname, "public"), { maxAge: 31557600000 })
);

app.get("/", (req: Request, res: Response) => {
  res.send("welcome to product micro service");
});

app.use("/", productRouter);

export default app;
