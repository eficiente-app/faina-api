import { Get, Route } from "@config/controller";
import { Request, Response } from "express";
import path from "path";

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
export class ApiController {
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
      version,
      author
    }: any = require(path.join(path.resolve("./"), "package.json"));

    return res.json({
      name: name,
      description: description,
      version: version,
      author: author
    });
  }
}

export default ApiController;
