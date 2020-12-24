import Controller, { Delete, Get, Post, Put, Route } from "@config/controller";
import { Request, Response } from "express";
import { QueryTypes } from "sequelize";

@Route("/api/pasta")
export class ApiPasta extends Controller {

  @Get("/:id?")
  async listar (req: Request, res: Response): Promise<Response> {
    try {
      let sql = `
        SELECT *
          FROM pasta
         WHERE pasta.excluido_em IS NULL
      `;

      if (req.params.id) {
        sql += `\n AND pasta.id =${req.params.id}`;
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
      const pasta: Array<any> = [];
      const pastaPasta: Array<any> = [];

      await this.faina().transaction(async (t) => {
        for (let i = 0; i < parametros.length; i++) {
          const registro = await this.faina().query(`
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
            replacements: {
              tipoId: parametros[i].tipoId,
              projetoId: parametros[i].projetoId,
              nome: parametros[i].nome,
              descricao: parametros[i].descricao
            },
            transaction: t,
            type: QueryTypes.INSERT
          });

          pasta.push(registro[0]);

          if (parametros[i].pastaId) {
            const registroPasta = await this.faina().query(`
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
               WHERE pasta.id = ${parametros[i].pastaId};
            `, {
              transaction: t,
              type: QueryTypes.INSERT
            });

            pastaPasta.push(registroPasta[0]);
          }
        }
      });

      return res.json({
        pasta,
        pastaPasta
      });
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
      const pasta: Array<any> = [];
      const pastaPasta: Array<any> = [];

      await this.faina().transaction(async (t) => {
        for (let i = 0; i < parametros.length; i++) {
          const registro = await this.faina().query(`
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
            replacements: {
              id: parametros[i].id,
              tipoId: parametros[i].tipoId,
              projetoId: parametros[i].projetoId,
              nome: parametros[i].nome,
              descricao: parametros[i].descricao,
              alteradoId: parametros[i].alteradoId,
              alteradoEm: parametros[i].alteradoEm
            },
            transaction: t,
            type: QueryTypes.UPDATE
          });

          pasta.push(registro[1]);

          if (parametros[i].pastaId && parametros[i].pastaIdNovo) {
            const registroPasta = await this.faina().query(`
                  /* Altera o Relacionamento da Pasta com a Pasta Mãe */
              UPDATE pasta_pasta
                 SET mae_id  = ${parametros[i].pastaIdNovo}
               WHERE filha_id = ${parametros[i].id}
                 AND mae_id  = ${parametros[i].pastaId};`, {
              type: QueryTypes.UPDATE,
              transaction: t
            });

            pastaPasta.push(registroPasta[1]);
          }
        }
      });

      return res.json({
        pasta,
        pastaPasta
      });
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
        mensagem: e.message,
        e
      });
    }
  }
}

export default ApiPasta;
