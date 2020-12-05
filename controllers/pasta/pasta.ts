import Controller, { Delete, Get, Post, Put, Route } from "@config/controller";
import { Request, Response } from "express";
import { QueryTypes } from "sequelize";

@Route("/api/pasta")
export class ApiPasta extends Controller {

  @Get("/qualquercoisa")
  async qq (_req: Request, res: Response): Promise<Response> {
    return res.json({
      qualquercoisa: "Ok"
    });
  }

  @Get("")
  async listar (_req: Request, res: Response): Promise<Response> {
    console.log(_req.body);
    const sql: any = await this.faina().query(`
        SELECT *
          FROM pasta
         WHERE pasta.excluido_em IS NULL
    `, {
      type: QueryTypes.SELECT
    });

    return res.json({
      sql: sql
    });
  }

  @Post("")
  async insert (req: Request, res: Response): Promise<Response> {
    try {
      const param = req.body;
      const registro: any = await this.faina().query(`
        INSERT
          INTO pasta
             ( tipo
             , projeto_id
             , nome
             , descricao
             )
        VALUES
             ( :tipo
             , :projetoId
             , :nome
             , :descricao
             )
        `, {
          replacements: {
            tipo: param.tipo,
            projetoId: param.projetoId,
            nome: param.nome,
            descricao: param.descricao
          }
        }
      );
      return res.json(registro);
    } catch (e) {
      return res.json({sucesso: false, mensagem: e.message, e: e});
    }
  }

  @Put("")
  async alterar (req: Request, res: Response): Promise<Response> {
    try {
      const param = req.body;
      const registro: any = await this.faina().query(`
        UPDATE pasta
           SET tipo        = :tipo
             , projeto_id  = :projetoId
             , nome        = :nome
             , descricao   = :descricao
             , alterado_id = :alteradoId
             , alterado_em = :alteradoEm
         WHERE id = :id
        `, {
          replacements: {
            id: param.id,
            tipo: param.tipo,
            projetoId: param.projetoId,
            nome: param.nome,
            descricao: param.descricao,
            alteradoId: param.alteradoId,
            alteradoEm: param.alteradoEm
          }
        }
      );
      return res.json(registro);
    } catch (e) {
      throw new Error(`Falha ao Alterar a Pasta!\n\n` + e.message);
    }
  }

  @Delete("/:id")
  async excluir (req: Request, res: Response): Promise<Response> {
    try {
      const registro: any = await this.faina().query(`
        UPDATE pasta
           SET excluido_em  = CURRENT_TIMESTAMP()
             , excluido_id  = :userId
         WHERE id           = ${req.query.id}
           AND excluido_em IS NULL
        `, {
          replacements: {
            userId: 0
          }
        }
      );
      return res.json(registro);
    } catch (e) {
      throw new Error(`Falha ao Incluir a Pasta!\n\n` + e.message);
    }
  }
}

export default ApiPasta;
