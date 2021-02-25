import Controller, { Delete, Get, Post, Put, Route } from "@config/controller";
import { Request, Response } from "express";
import { QueryTypes } from "sequelize";

/**
 * @export
 *
 * @class Controller
 *
 * @author Daniel Araujo
 *
 * @classdesc Classe Controller responsável pelo cadastro e manutenção de uma Tarefa.
 *
 * @extends {ProjetoController}
 */
@Route("/api/tarefa")
export class ApiTarefa extends Controller {
  protected readonly rulesInsert: any;
  protected readonly rulesUpdate: any;

  constructor () {
    super();

    this.rulesInsert = { };
  }

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
                 ( :tipo_id
                 , :classificacao_id
                 , :status_id
                 , :nome
                 , :conteudo
                 , :tarefa_id
                 , :incluido_id
                 );
          `, {
            replacements: {
              tipo_id: parametros[i].tipo_id,
              projeto_id: parametros[i].projeto_id,
              nome: parametros[i].nome,
              descricao: parametros[i].descricao
            },
            transaction: t,
            type: QueryTypes.INSERT
          });

          tarefa.push(registroTarefa[0]);

          if (parametros[i].pasta_id) {
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
               WHERE pasta.id = ${parametros[i].pasta_id};
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
                , projeto_id  = :projeto_id
                , nome        = :nome
                , descricao   = :descricao
                , alterado_id = :alterado_id
                , alterado_em = :alterado_em
            WHERE excluido_em IS NULL
              AND id = :id
          `, {
            replacements: {
              id: parametros[i].id,
              tipo: parametros[i].tipo,
              projeto_id: parametros[i].projeto_id,
              nome: parametros[i].nome,
              descricao: parametros[i].descricao,
              alterado_id: parametros[i].alterado_id,
              alterado_em: parametros[i].alterado_em
            },
            transaction: t,
            type: QueryTypes.UPDATE
          });

          tarefa.push(registroTarefa[1]);

          if (parametros[i].pasta_id && parametros[i].pasta_idNovo) {
            const registroPastaTarefa = await this.select(`
              /* Altera o Relacionamento da Tarega com a Pasta Tarefa */
              UPDATE pasta_pasta
                SET mae_id  = ${parametros[i].pasta_idNovo}
              WHERE fila_id = ${parametros[i].id}
                AND mae_id  = ${parametros[i].pasta_id};
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

export default ApiTarefa;
