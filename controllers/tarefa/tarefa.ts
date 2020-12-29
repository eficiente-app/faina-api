import Controller, { Delete, Get, Post, Put, Route } from "@config/controller";
import { Request, Response } from "express";
import { QueryTypes } from "sequelize";

@Route("/api/tarefa")
export class ApiTarefa extends Controller {

  @Get("/:id?")
  async listar (req: Request, res: Response): Promise<Response> {
    try {
      let sql = `
        SELECT *
          FROM tarefa
         WHERE tarefa.excluido_em IS NULL
      `;

      if (req.params.id) {
        sql += `\n AND tarefa.id = ${req.params.id}`;
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
      const tarefa: Array<any> = [];
      const pastaTarefa: Array<any> = [];

      await this.faina().transaction(async (t) => {
        for (let i = 0; i < parametros.length; i++) {
          const registroTarefa = await this.select(`
            /* Inserir a Tarega */
            INSERT
              INTO tarefa
                 ( tipo_id
                 , classificacao_id
                 , status_id
                 , nome
                 , conteudo
                 , tarefa_id
                 , incluido_id
                 )
            VALUES
                 ( :tipoId
                 , :classificacaoId
                 , :statusId
                 , :nome
                 , :conteudo
                 , :tarefaId
                 , :incluidoId
                 );
          `, {
            replacements: {
              tipoId: parametros[i].tipoId,
              projetoId: parametros[i].projetoId,
              nome: parametros[i].nome,
              descricao: parametros[i].descricao
            },
            transaction: t,
            type: QueryTypes.INSERT
          });

          tarefa.push(registroTarefa[0]);

          if (parametros[i].pastaId) {
            const registroPastaTarega = await this.select(`
              /* Inserir o Relacionamento da Tarefa com a Pasta Tarefa */
              INSERT
                INTO pasta_tarefa
                   ( pasta_id
                   , tarefa_id
                   , incluido_id
                   )
              SELECT pasta.id
                   , LAST_INSERT_ID()
                   , ${0}
                FROM pasta
               WHERE pasta.id = ${parametros[i].pastaId};
            `, {
              type: QueryTypes.INSERT,
              transaction: t
            });

            pastaTarefa.push(registroPastaTarega[0]);
          }
        }
      });

      return res.json({
        tarefa,
        pastaTarefa
      });
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
      const tarefa: Array<any> = [];
      const pastaTarefa: Array<any> = [];

      await this.faina().transaction(async (t) => {
        for (let i = 0; i < parametros.length; i++) {
          const registroTarefa = await this.select(`
            /* Altera informações sobre a tarega */
            UPDATE pasta
              SET tipo        = :tipo
                , projeto_id  = :projetoId
                , nome        = :nome
                , descricao   = :descricao
                , alterado_id = :alteradoId
                , alterado_em = :alteradoEm
            WHERE excluido_em IS NULL
              AND id = :id
          `, {
            replacements: {
              id: parametros[i].id,
              tipo: parametros[i].tipo,
              projetoId: parametros[i].projetoId,
              nome: parametros[i].nome,
              descricao: parametros[i].descricao,
              alteradoId: parametros[i].alteradoId,
              alteradoEm: parametros[i].alteradoEm
            },
            transaction: t,
            type: QueryTypes.UPDATE
          });

          tarefa.push(registroTarefa[1]);

          if (parametros[i].pastaId && parametros[i].pastaIdNovo) {
            const registroPastaTarefa = await this.select(`
              /* Altera o Relacionamento da Tarega com a Pasta Tarefa */
              UPDATE pasta_pasta
                SET mae_id  = ${parametros[i].pastaIdNovo}
              WHERE fila_id = ${parametros[i].id}
                AND mae_id  = ${parametros[i].pastaId};
            `, {
              type: QueryTypes.UPDATE,
              transaction: t
            });

            pastaTarefa.push(registroPastaTarefa[1]);
          }
        }
      });

      return res.json({
        tarefa,
        pastaTarefa
      });
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
        UPDATE pasta
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
        mensagem: e.message
      });
    }
  }
}

export default ApiTarefa;
