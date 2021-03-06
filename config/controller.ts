import Database from "@config/database";
import { All, Delete, Get, Head, Options, Patch, Post, Put } from "@config/decorators/request";
import Route from "@config/decorators/route";
import HelperError from "@helpers/error";
import HelperMessage from "@helpers/message";
import { QueryTypes } from "sequelize";

export {
  All,
  Delete,
  Get,
  Head,
  Options,
  Patch,
  Post,
  Put,
  Route
};

export abstract class Controller {
  readonly database: Database;
  protected error: HelperError;
  protected message: HelperMessage;

  constructor () {
    this.database = new Database();
    this.message = new HelperMessage();
    this.error = new HelperError(this.message);
  }

  protected faina () {
    <any>this.database.config();

    return this.database.instance;
  }

  protected async select (sql: string, opcoes: any = { }): Promise<any> {
    const query = await this.faina().query(sql, {
      type: QueryTypes.SELECT,
      ...opcoes
    });

    return query;
  }

  public toArray (param: any): Object[] {
    if (!Array.isArray(param)) {
      param = [param];
    }

    return param;
  }
}

export default Controller;
