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
      const pasta: Array<any> = [];
      const pastaPasta: Array<any> = [];

      await this.faina().transaction(async (t) => {
        for (let i = 0; i < parametros.length; i++) {
          const registro = await this.select(`
            /* Inserir a Pasta */
            INSERT
              INTO pasta
                 ( tipo_id
                 , projeto_id
                 , nome
                 , descricao
                 )
            VALUES
                 ( :tipo_id
                 , :projeto_id
                 , :nome
                 , :descricao
                 );`, {
            replacements: {
              tipo_id: parametros[i].tipo_id,
              projeto_id: parametros[i].projeto_id,
              nome: parametros[i].nome,
              descricao: parametros[i].descricao
            },
            transaction: t,
            type: QueryTypes.INSERT
          });

          pasta.push(registro[0]);

          if (parametros[i].pasta_id) {
            const registroPasta = await this.select(`
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
               WHERE pasta.id = ${parametros[i].pasta_id};
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
        mensagem: e.message
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
          const registro = await this.select(`
            /* Altera informações sobre a pasta */
            UPDATE pasta
               SET tipo_id     = :tipo_id
                 , projeto_id  = :projeto_id
                 , nome        = :nome
                 , descricao   = :descricao
                 , alterado_id = :alterado_id
                 , alterado_em = :alterado_em
             WHERE excluido_em IS NULL
               AND id = :id`, {
            replacements: {
              id: parametros[i].id,
              tipo_id: parametros[i].tipo_id,
              projeto_id: parametros[i].projeto_id,
              nome: parametros[i].nome,
              descricao: parametros[i].descricao,
              alterado_id: parametros[i].alterado_id,
              alterado_em: parametros[i].alterado_em
            },
            transaction: t,
            type: QueryTypes.UPDATE
          });

          pasta.push(registro[1]);

          if (parametros[i].pasta_id && parametros[i].pasta_idNovo) {
            const registroPasta = await this.select(`
                  /* Altera o Relacionamento da Pasta com a Pasta Mãe */
              UPDATE pasta_pasta
                 SET mae_id  = ${parametros[i].pasta_idNovo}
               WHERE filha_id = ${parametros[i].id}
                 AND mae_id  = ${parametros[i].pasta_id};`, {
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

export default ApiPasta;
