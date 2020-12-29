import Controller, { Delete, Get, Post, Put, Route } from "@config/controller";
import Projeto from "@models/projeto";
import { Request, Response } from "express";
import validate from "validate.js";

/**
 * @export
 *
 * @class Controller
 *
 * @author Ícaro Tavares
 *
 * @classdesc Classe Controller responsável pelo cadastro e manutenção de um projeto.
 *
 * @extends {ProjetoController}
 */
@Route("/api/projeto")
export class ProjetoController extends Controller {
  protected readonly rulesInsert: any;
  protected readonly rulesUpdate: any;

  constructor () {
    super();

    this.rulesInsert = this.rules([
      "nome",
      "descricao",
      "tipo"
    ]);

    this.rulesUpdate = Object.assign(this.rules(["id"]), this.rulesInsert);
  }

  protected query (): string {
    const sql: string = `
        SELECT p.id
             , p.nome
             , p.descricao
             , p.tipo
             , pt.descricao AS tipoDescricao
             , pt.nome AS tipoNome
          FROM projeto AS p

         INNER
          JOIN projeto_tipo AS pt
            ON pt.id = p.tipo`;

    return sql;
  }

  /**
   * @author Ícaro Tavares
   *
   * @description Retorna uma lista de projetos cadastrados.
   *
   * @param {Request} req
   * @param {Response} res
   *
   * @returns {Promise<Response>}
   *
   * @memberof ProjetoController
   */
  @Get()
  async find (_req: Request, res: Response): Promise<Response> {
    try {
      const sql: string = this.query();

      const projetos: any = await this.select(sql);

      return res.json(projetos);
    } catch (e) {
      return res.json({
        sucesso: false,
        mensagem: e.message
      });
    }
  }

  /**
   * @author Ícaro Tavares
   *
   * @description Retorna as informações específicas de um projeto.
   *
   * @param {Request} req
   * @param {Response} res
   *
   * @returns {Promise<Response>}
   *
   * @memberof ProjetoController
   */
  @Get("/:id")
  async read (req: Request, res: Response): Promise<Response> {
    try {
      const { id }: any = req.params;

      if (isNaN(id)) {
        throw new Error("Projeto inválido.");
      }

      let sql: string = this.query();
      sql += ` AND p.id = :id`;

      const projeto: any = await this.select(sql, {
        plain: true,
        replacements: {
          id: Number(req.params.id)
        }
      });

      if (validate.isEmpty(projeto)) {
        throw new Error("Projeto não encontrado.");
      }

      return res.json(projeto);
    } catch (e) {
      return res.json({
        sucesso: false,
        mensagem: e.message
      });
    }
  }

  /**
   * @author Ícaro Tavares
   *
   * @description Cadastra um novo projeto no sistema.
   *
   * @param {Request} req
   * @param {Response} res
   *
   * @returns {Promise<Response>}
   *
   * @memberof ProjetoController
   */
  @Post()
  async create (req: Request, res: Response): Promise<Response> {
    try {
      const errors: any = await validate(req.body, this.rulesInsert);

      if (errors) {
        return res.json({
          status: false,
          errors
        });
      }

      const projeto: Projeto = Projeto.build(req.body);

      await projeto.save();

      return res.json({
        status: true,
        mensagem: "Projeto cadastrado com sucesso."
      });
    } catch (e) {
      return res.json({
        sucesso: false,
        mensagem: e.message
      });
    }
  }

  /**
   * @author Ícaro Tavares
   *
   * @description Altera as informações de um projeto.
   *
   * @param {Request} req
   * @param {Response} res
   *
   * @returns {Promise<Response>}
   *
   * @memberof ProjetoController
   */
  @Put()
  async update (_req: Request, res: Response): Promise<Response> {
    try {

    } catch (e) {
      return res.json({
        sucesso: false,
        mensagem: e.message
      });
    }
  }

  /**
   * @author Ícaro Tavares
   *
   * @description Exclui um projeto no sistema.
   *
   * @param {Request} req
   * @param {Response} res
   *
   * @returns {Promise<Response>}
   *
   * @memberof ProjetoController
   */
  @Delete("/:id")
  async delete (_req: Request, res: Response): Promise<Response> {
    try {

    } catch (e) {
      return res.json({
        sucesso: false,
        mensagem: e.message
      });
    }
  }
}

export default ProjetoController;
