import Controller, { Delete, Get, Post, Put, Route } from "@config/controller";
import { Request, Response } from "express";
import { QueryTypes } from "sequelize";

@Route("/api/tarefa")
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
      const parametros = this.toArray(req.body);

      const tarefa: any[] = [];
      const pastaTarefa: any[] = [];
      await this.faina().transaction(async (t) => {
        parametros.forEach( async (paramTarefa: any) => {

          tarefa.push(await this.faina().query(`
                /* Inserir a Pasta */
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
                 );`, {
            type: QueryTypes.INSERT,
            replacements: {
              tipoId: paramTarefa.tipoId,
              projetoId: paramTarefa.projetoId,
              nome: paramTarefa.nome,
              descricao: paramTarefa.descricao
            },
            transaction: t
          }));

          if (paramTarefa.pastaId) {
            pastaTarefa.push(await this.faina().query(`
                  /* Inserir o Relacionamento da Pasta com a Pasta Mãe */
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
               WHERE pasta.id = ${paramTarefa.pastaId};`, {
              type: QueryTypes.INSERT,
              transaction: t
            }));
          }
        });
      });

      const registro = {
        tarefa: tarefa,
        pastaTarefa: pastaTarefa
      };

      return res.json(registro);
    } catch (e) {
      return res.json({sucesso: false, mensagem: e.message, e: e});
    }
  }

  @Put("")
  async alterar (req: Request, res: Response): Promise<Response> {
    try {
      const param = req.body;
      let pasta, pastaPasta;

      await this.faina().transaction(async (t) => {
        pasta = await this.faina().query(`
              /* Altera informações sobre a pasta */
          UPDATE pasta
             SET tipo        = :tipo
               , projeto_id  = :projetoId
               , nome        = :nome
               , descricao   = :descricao
               , alterado_id = :alteradoId
               , alterado_em = :alteradoEm
           WHERE excluido_em IS NULL
             AND id = :id`, {
          type: QueryTypes.UPDATE,
          replacements: {
            id: param.id,
            tipo: param.tipo,
            projetoId: param.projetoId,
            nome: param.nome,
            descricao: param.descricao,
            alteradoId: param.alteradoId,
            alteradoEm: param.alteradoEm
          },
          transaction: t
        });

        if (param.pastaId && param.pastaIdNovo) {
          pastaPasta = await this.faina().query(`
                /* Altera o Relacionamento da Pasta com a Pasta Mãe */
            UPDATE pasta_pasta
               SET mae_id  = ${param.pastaIdNovo}
             WHERE fila_id = ${param.Id}
               AND mae_id  = ${param.pastaId};`, {
            type: QueryTypes.UPDATE,
            transaction: t
          });
        }
      });

      const registro = {
        pasta: pasta,
        pastaPasta: pastaPasta
      };

      return res.json(registro);
    } catch (e) {
      return res.json({sucesso: false, mensagem: e.message, e: e});
    }
  }

  @Delete("/:id")
  async excluir (req: Request, res: Response): Promise<Response> {
    try {
      const registro: any = await this.faina().query(`
        UPDATE pasta
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

export default ApiPasta;
