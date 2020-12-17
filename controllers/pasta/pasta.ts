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
      const parametros: Array<any> = this.toArray(req.body);
      const pasta: any[] = [];
      const pastaPasta: any[] = [];

      await this.faina().transaction(async (t) => {
        for (let i = 0; i < parametros.length; i++) {
          const reg = await this.faina().query(`
                /* Inserir a Pasta */
            INSERT
              INTO pasta
                 ( tipo_id
                 , projeto_id
                 , nome
                 , descricao
                 )
            VALUES
                 ( :tipoId
                 , :projetoId
                 , :nome
                 , :descricao
                 );`, {
            type: QueryTypes.INSERT,
            replacements: {
              tipoId: parametros[i].tipoId,
              projetoId: parametros[i].projetoId,
              nome: parametros[i].nome,
              descricao: parametros[i].descricao
            },
            transaction: t
          });

          pasta.push(reg[0]);

          if (parametros[i].pastaId) {
            const regPasta = await this.faina().query(`
                  /* Inserir o Relacionamento da Pasta com a Pasta Mãe */
              INSERT
                INTO pasta_pasta
                   ( mae_id
                   , filha_id
                   , incluido_id
                   )
              SELECT pasta.id
                   , LAST_INSERT_ID()
                   , ${0}
                FROM pasta
               WHERE pasta.id = ${parametros[i].pastaId};`, {
              type: QueryTypes.INSERT,
              transaction: t
            });

            pastaPasta.push(regPasta[0]);
          }
        }
      });

      return res.json({ pasta, pastaPasta });
    } catch (e) {
      return res.json({sucesso: false, mensagem: e.message, e: e});
    }
  }

  @Put("")
  async alterar (req: Request, res: Response): Promise<Response> {
    try {
      const parametros: Array<any> = this.toArray(req.body);
      const pasta: any[] = [];
      const pastaPasta: any[] = [];

      await this.faina().transaction(async (t) => {
        for (let i = 0; i < parametros.length; i++) {
          pasta.push(await this.faina().query(`
                /* Altera informações sobre a pasta */
            UPDATE pasta
               SET tipo_id     = :tipoId
                 , projeto_id  = :projetoId
                 , nome        = :nome
                 , descricao   = :descricao
                 , alterado_id = :alteradoId
                 , alterado_em = :alteradoEm
             WHERE excluido_em IS NULL
               AND id = :id`, {
            type: QueryTypes.UPDATE,
            replacements: {
              id: parametros[i].id,
              tipoId: parametros[i].tipoId,
              projetoId: parametros[i].projetoId,
              nome: parametros[i].nome,
              descricao: parametros[i].descricao,
              alteradoId: parametros[i].alteradoId,
              alteradoEm: parametros[i].alteradoEm
            },
            transaction: t
          }));

          if (parametros[i].pastaId && parametros[i].pastaIdNovo) {
            pastaPasta.push(await this.faina().query(`
                  /* Altera o Relacionamento da Pasta com a Pasta Mãe */
              UPDATE pasta_pasta
                 SET mae_id  = ${parametros[i].pastaIdNovo}
               WHERE filha_id = ${parametros[i].id}
                 AND mae_id  = ${parametros[i].pastaId};`, {
              type: QueryTypes.UPDATE,
              transaction: t
            }));
          }
        }
      });

      return res.json({ pasta, pastaPasta });
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
