import Controller, { Delete, Get, Post, Put, Route } from "@config/controller";
import { Request, Response } from "express";
import { QueryTypes } from "sequelize";

@Route("/api/tarefa/tipo")
export class ApiTarefaTipo extends Controller {

  @Get("")
  async listar (_req: Request, res: Response): Promise<Response> {
    try {
      const sql: any = await this.faina().query(`
          SELECT *
            FROM tarefa_tipo
           WHERE tarefa_tipo.excluido_em IS NULL
      `, {
        type: QueryTypes.SELECT
      });

      return res.json({
        sql: sql
      });
    } catch (e) {
      return res.json({sucesso: false, mensagem: e.message, e: e});
    }
  }

  @Post("")
  async insert (req: Request, res: Response): Promise<Response> {
    try {
      const param = req.body;
      const registro: any = await this.faina().query(`
        INSERT
          INTO tarefa_tipo
             ( nome
             , descricao
             )
        VALUES
             ( :nome
             , :descricao
             )
        `, {
          replacements: {
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
      console.log(param);
      const registro: any = await this.faina().query(`
        UPDATE tarefa_tipo
           SET nome        = :nome
             , descricao   = :descricao
             , alterado_id = :alteradoId
             , alterado_em = :alteradoEm
         WHERE id = :id
        `, {
          replacements: {
            id: param.id,
            nome: param.nome,
            descricao: param.descricao,
            alteradoId: param.alteradoId,
            alteradoEm: param.alteradoEm
          }
        }
      );
      return res.json(registro);
    } catch (e) {
      return res.json({sucesso: false, mensagem: e.message, e: e});
    }
  }

  @Delete("/:id")
  async excluir (req: Request, res: Response): Promise<Response> {
    try {
      const registro: any = await this.faina().query(`
        UPDATE tarefa_tipo
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
      return res.json({sucesso: false, mensagem: e.message, e: e});
    }
  }
}

export default ApiTarefaTipo;
