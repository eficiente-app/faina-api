import Bluebird from "bluebird";
import path from "path";
import sequelize from  "sequelize";
import { Sequelize } from "sequelize-typescript";

class Database {
  alias: string;
  instance: Sequelize;
  params: any;

  constructor () {
    this.params = {
      dialect: process.env.DB_DIALECT,
      database: process.env.DB_DATABASE,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      logging: (process.env.APP_DEBUG === "true") ? console.log : false,
      modelPaths: [
        path.join(__dirname, "../../models")
      ],
      dialectOptions: {
        useUTC: true,
        timezone: "Etc/GMT"
      },
      define: {
        timestamps: false,
        underscored: true,
        paranoid: true
      }
    };
  }

  async config (): Promise<void> {
    this.instance = new Sequelize(this.params);

    this.instance.query = <any>function () {
      return new Bluebird(async (resolve: any, reject: any) => {
        try {
          const result = await (<any>sequelize).Sequelize.prototype.query.apply(this, arguments);

          resolve(result);
        } catch (err) {
          if (err instanceof sequelize.AccessDeniedError) {
            reject(new Error("Erro ao conectar no banco de dados."));
          } else {
            reject(err);
          }
        }
      });
    };
  }
}

export default Database;
