import errorHandler from "errorhandler";
import app from "./app";
import config from "./config";
import databaseConnection from "./database/connection";

/**
 * Error Handler. Provides full stack
 */
if (process.env.NODE_ENV === "development") {
  app.use(errorHandler());
}

databaseConnection();

/**
 * Start Express server.
 */
const server = app.listen(config.PORT, () => {
  console.log(
    "  App is running at http://localhost:%d in %s mode",
    config.PORT,
    app.get("env")
  );
  console.log("  Press CTRL-C to stop\n");
});

export default server;
