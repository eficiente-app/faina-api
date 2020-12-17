import Controller, { Delete, Get, Post, Put, Route } from "@config/controller";
import { Request, Response } from "express";
import { QueryTypes } from "sequelize";

@Route("/api/tarefa/etapa/tipo")
export class ApiTarefaEtapaTipo extends Controller {

  @Get("")
  async listar (_req: Request, res: Response): Promise<Response> {
    try {
      const sql: any = await this.faina().query(`
          SELECT *
            FROM tarefa_etapa_tipo
           WHERE tarefa_etapa_tipo.excluido_em IS NULL
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
          INTO tarefa_etapa_tipo
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
        UPDATE tarefa_etapa_tipo
           SET nome        = :nome
             , descricao   = :descricao
             , alterado_id = :alteradoId
             , alterado_em = current_timestamp()
         WHERE id = :id
        `, {
          replacements: {
            id: param.id,
            nome: param.nome,
            descricao: param.descricao,
            alteradoId: param.alteradoId
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
        UPDATE tarefa_etapa_tipo
           SET excluido_em  = CURRENT_TIMESTAMP()
             , excluido_id  = :userId
         WHERE id           = ${req.params.id}
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

export default ApiTarefaEtapaTipo;
