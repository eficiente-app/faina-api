import Controller, { Delete, Get, Post, Put, Route } from "@config/controller";
import { Request, Response } from "express";
import { QueryTypes } from "sequelize";

@Route("/api/tarefa/etapa/tipo")
export class ApiTarefaEtapaTipo extends Controller {

  @Get("/:id?")
  async listar (req: Request, res: Response): Promise<Response> {
    try {
      let sql = `
        SELECT *
          FROM tarefa_etapa_tipo
         WHERE tarefa_etapa_tipo.excluido_em IS NULL
      `;

      if (req.params.id) {
        sql += `\n AND tarefa_etapa_tipo.id = ${req.params.id}`;
      }

      const registros: any = await this.faina().query(sql, {
        type: QueryTypes.SELECT
      });

      return res.json(registros);
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
      const tarefaEtapaTipo: Array<any> = [];

      await this.faina().transaction(async (t) => {
        for (let i = 0; i < parametros.length; i++) {
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
              nome: parametros[i].nome,
              descricao: parametros[i].descricao
            },
            transaction: t,
            type: QueryTypes.INSERT
          });

          tarefaEtapaTipo.push(registro[0]);
        }
      });

      return res.json(tarefaEtapaTipo);
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
      const tarefaEtapaTipo: Array<any> = [];

      await this.faina().transaction(async (t) => {
        for (let i = 0; i < parametros.length; i++) {
          const registro: any = await this.faina().query(`
            UPDATE tarefa_etapa_tipo
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

          tarefaEtapaTipo.push(registro[1]);
        }
      });

      return res.json(tarefaEtapaTipo);
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
        UPDATE tarefa_etapa_tipo
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

export default ApiTarefaEtapaTipo;
