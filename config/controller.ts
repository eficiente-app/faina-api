import Database from "@config/database";
import { All, Delete, Get, Head, Options, Patch, Post, Put } from "@config/decorators/request";
import Route from "@config/decorators/route";

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

  constructor () {
    this.database = new Database();
  }

  protected faina () {
    <any>this.database.config();

    return this.database.instance;
  }

  public toArray (param: any): Object[] {
    if (!Array.isArray(param)) {
      param = [param];
    }
    return param;
  }
}

export default Controller;
