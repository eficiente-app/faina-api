import Database from "@config/database";
import routing from "@config/router";
import bodyParser from "body-parser";
import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import path from "path";

export class FainaServer {
  async start () {
    const app: express.Express = express();
    const publicPath: any = path.join(__dirname, "../../../public");

    dotenv.config({
      path: ".env"
    });

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(compression());
    app.use(cors());
    app.use(express.static(publicPath));
    app.use(helmet());

    await routing(app);

    const database: Database = new Database();
    await <any>database.config();

    app.get("*", (_req: express.Request, res: express.Response) => {
      res.sendFile(path.join(publicPath, "index.html"));
    });

    app.listen(process.env.APP_PORT, () => {
      console.log(`Servidor inicializado na porta ${process.env.APP_PORT}!`);
    });
  }
}

export default new FainaServer();
