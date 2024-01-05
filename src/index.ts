// tsc --init      this will create tsconfig.json file for us

import dotenv from "dotenv";
dotenv.config();
import winstonLogger from "./utils/winston";
import express, { Express, Request, Response, NextFunction } from "express";
import { connectDB } from "./config/dbConnection";
import routes from "./routes";
import client from "./config/dbClient";
import HttpCodes from "./constants/httpCodes";
import appMessages from "./constants/appMessages";
class ExpressServer {
  private app: Express;
  private port: Number;
  private setUpRoutes(): void {
    this.app.use(express.json()); // For parsing application/json
    // Global middleware
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      // Line 1: Timestamp - Route Name
      const timestamp: string =
        new Date().toLocaleDateString() +
        `    ` +
        new Date().toLocaleTimeString();
      const routeName: string = req.originalUrl;
      // winstonLogger.log(`info`, `${timestamp}            Route: ${routeName}`);
      winstonLogger.log(`info`, `Route: ${routeName}`);
      // console.log(`${timestamp}            Route: ${routeName}`);

      // Line 2: Log body data for POST, PUT, or DELETE requests
      const methodsToLog = [`POST`, `PUT`, `DELETE`];
      if (methodsToLog.includes(req.method)) {
        winstonLogger.info(
          `Request Body: ${JSON.stringify(req.body, null, 2)}\n`
        );

        // console.log(`Request Body:`, req.body, `\n`);
      }

      next(); // Continue to the next middleware or route handler
    });
    this.app.get(`/`, (req: Request, res: Response) => {
      res.status(HttpCodes.OK).send(`Welcome to web api's by Nafay`);
    });
    routes(this.app);
    // Global middleware for handling unmatched routes (API not found)
    this.app.use((req, res, next) => {
      const error: any = new Error(`API not found`);
      next(error);
    });

    // Error handling middleware
    this.app.use(
      (err: any, req: Request, res: Response, next: NextFunction) => {
        res.status(HttpCodes.NOT_FOUND).send({
          error: {
            message: err.message || appMessages.INTERNAL_SERVER_ERROR,
          },
        });
      }
    );
  }
  constructor() {
    this.port = Number(process.env.APP_PORT) || 8089;
    this.app = express();
    this.setUpRoutes();
  }
  private async connectDB(): Promise<void> {
    await client.connect();
  }
  async start(): Promise<void> {
    await this.connectDB();
    winstonLogger.info(`connected with Database!`);

    this.app.listen(this.port, () => {
      winstonLogger.info(`app listening on port ${this.port}\n`);
      // console.log(`app listening on port ${port}\n`);
    });
  }
}

const server = new ExpressServer();
server.start();
