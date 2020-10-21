import bodyParser from "body-parser";
import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import path from "path";

const app: express.Express = express();
const publicPath: any = path.join(__dirname, "../../../public");

dotenv.config({
  path: ".env"
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.use(cors());
app.use(express.static(publicPath));
app.use(helmet());

app.get("*", (_req: express.Request, res: express.Response) => {
  res.sendFile(path.join(publicPath, "index.ejs"));
});

export default app;
