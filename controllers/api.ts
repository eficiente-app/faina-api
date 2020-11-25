import Controller, { Get, Route } from "@config/controller";
import { Request, Response } from "express";
import path from "path";
import { QueryTypes } from "sequelize";

/**
 * @export
 *
 * @class Controller
 *
 * @author Ícaro Tavares
 *
 * @classdesc Modelo rota
 *
 * @extends {ApiController}
 */
@Route("/")
export class ApiController extends Controller {
  /**
   * @author Ícaro Tavares
   *
   * @description Informações do servidor.
   *
   * @param {Request} req
   * @param {Response} res
   *
   * @returns {Promise<Response>}
   *
   * @memberof ApiController
   */
  @Get("/api")
  async api (_req: Request, res: Response): Promise<Response> {
    const {
      name,
      description,
      author
    }: any = require(path.join(path.resolve("./"), "package.json"));

    const sql: any = await this.faina().query("SELECT 'true' AS connection", {
      plain: true,
      type: QueryTypes.SELECT
    });

    return res.json({
      name: name,
      description: description,
      author: author,
      sql: sql.connection
    });
  }
}

export default ApiController;
