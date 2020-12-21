import Controller, { Delete, Get, Post, Put, Route } from "@config/controller";
import { Request, Response } from "express";
import { QueryTypes } from "sequelize";

@Route("/api/tarefa/status")
export class ApiTarefaStatus extends Controller {

  @Get("")
  async listar (_req: Request, res: Response): Promise<Response> {
    try {
      const sql: any = await this.faina().query(`
          SELECT *
            FROM tarefa_status
           WHERE tarefa_status.excluido_em IS NULL
      `, {
        type: QueryTypes.SELECT
      });

      return res.json({ sql });
    } catch (e) {
      return res.json({
        sucesso: false,
        mensagem: e.message,
        e
      });
    }
  }

  @Post("")
  async insert (req: Request, res: Response): Promise<Response> {
    try {
      const parametros: Array<any> = this.toArray(req.body);
      const tarefaStatus: Array<any> = [];

      await this.faina().transaction(async (t) => {
        for (let i = 0; i < parametros.length; i++) {
          const registro: any = await this.faina().query(`
            INSERT
              INTO tarefa_status
                ( nome
                , descricao
                )
            VALUES
                ( :nome
                , :descricao
                )
          `, {
            replacements: {
              nome: parametros[i].nome,
              descricao: parametros[i].descricao
            },
            transaction: t,
            type: QueryTypes.INSERT,
          });

          tarefaStatus.push(registro[0]);
        }
      });

      return res.json(tarefaStatus);
    } catch (e) {
      return res.json({
        sucesso: false,
        mensagem: e.message,
        e
      });
    }
  }

  @Put("")
  async alterar (req: Request, res: Response): Promise<Response> {
    try {
      const parametros: Array<any> = this.toArray(req.body);
      const tarefaStatus: Array<any> = [];

      await this.faina().transaction(async (t) => {
        for (let i = 0; i < parametros.length; i++) {
          const registro: any = await this.faina().query(`
            UPDATE tarefa_status
               SET nome        = :nome
                 , descricao   = :descricao
                 , alterado_id = :alteradoId
                 , alterado_em = :alteradoEm
             WHERE id = :id
          `, {
            replacements: {
              id: parametros[i].id,
              nome: parametros[i].nome,
              descricao: parametros[i].descricao,
              alteradoId: parametros[i].alteradoId,
              alteradoEm: parametros[i].alteradoEm
            },
            transaction: t,
            type: QueryTypes.UPDATE
          });

          tarefaStatus.push(registro[1]);
        }
      });

      return res.json(tarefaStatus);
    } catch (e) {
      return res.json({
        sucesso: false,
        mensagem: e.message,
        e
      });
    }
  }

  @Delete("/:id")
  async excluir (req: Request, res: Response): Promise<Response> {
    try {
      const registro: any = await this.faina().query(`
        UPDATE tarefa_status
           SET excluido_em  = CURRENT_TIMESTAMP()
             , excluido_id  = :userId
         WHERE id           = ${req.params.id}
           AND excluido_em IS NULL
      `, {
        replacements: {
          userId: 0
        },
        type: QueryTypes.UPDATE
      });

      return res.json(registro[1]);
    } catch (e) {
      return res.json({
        sucesso: false,
        mensagem: e.message,
        e
      });
    }
  }
}

export default ApiTarefaStatus;
