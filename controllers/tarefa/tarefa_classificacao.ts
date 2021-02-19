import Controller, { Delete, Get, Post, Put, Route } from "@config/controller";
import { Request, Response } from "express";
import { QueryTypes } from "sequelize";

@Route("/api/tarefa/classificacao")
export class ApiTarefaClassificacao extends Controller {

  @Get("/:id?")
  async listar (req: Request, res: Response): Promise<Response> {
    try {
      let sql = `
        SELECT *
          FROM tarefa_classificacao
         WHERE tarefa_classificacao.excluido_em IS NULL
      `;

      if (req.params.id) {
        sql += `\n AND tarefa_classificacao.id = ${req.params.id}`;
      }

      const registros: any = await this.select(sql, {
        type: QueryTypes.SELECT
      });

      return res.json(registros);
    } catch (e) {
      return res.json({
        sucesso: false,
        mensagem: e.message
      });
    }
  }

  @Post("")
  async insert (req: Request, res: Response): Promise<Response> {
    try {
      const parametros: Array<any> = this.toArray(req.body);
      const tarefaClassificacao: Array<any> = [];

      await this.faina().transaction(async (t) => {
        for (let i = 0; i < parametros.length; i++) {
          const registro: any = await this.select(`
            INSERT
              INTO tarefa_classificacao
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

          tarefaClassificacao.push(registro[0]);
        }
      });

      return res.json(tarefaClassificacao);
    } catch (e) {
      return res.json({
        sucesso: false,
        mensagem: e.message
      });
    }
  }

  @Put("")
  async alterar (req: Request, res: Response): Promise<Response> {
    try {
      const parametros: Array<any> = this.toArray(req.body);
      const tarefaClassificacao: Array<any> = [];

      await this.faina().transaction(async (t) => {
        for (let i = 0; i < parametros.length; i++) {
          const registro: any = await this.select(`
            UPDATE tarefa_classificacao
               SET nome        = :nome
                 , descricao   = :descricao
                 , alterado_id = :alterado_id
                 , alterado_em = :alterado_em
             WHERE id = :id
          `, {
            replacements: {
              id: parametros[i].id,
              nome: parametros[i].nome,
              descricao: parametros[i].descricao,
              alterado_id: parametros[i].alterado_id,
              alterado_em: parametros[i].alterado_em
            },
            transaction: t,
            type: QueryTypes.UPDATE
          });

          tarefaClassificacao.push(registro[1]);
        }
      });

      return res.json(tarefaClassificacao);
    } catch (e) {
      return res.json({
        sucesso: false,
        mensagem: e.message
      });
    }
  }

  @Delete("/:id")
  async excluir (req: Request, res: Response): Promise<Response> {
    try {
      const registro: any = await this.select(`
        UPDATE tarefa_classificacao
           SET excluido_em  = CURRENT_TIMESTAMP()
             , excluido_id  = :user_id
         WHERE id           = ${req.params.id}
           AND excluido_em IS NULL
      `, {
        replacements: {
          user_id: 0
        },
        type: QueryTypes.UPDATE
      });

      return res.json(registro[1]);
    } catch (e) {
      return res.json({
        sucesso: false,
        mensagem: e.message
      });
    }
  }
}

export default ApiTarefaClassificacao;