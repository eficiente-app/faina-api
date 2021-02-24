import Controller, { Get, Route } from "@config/controller";
import { Request, Response } from "express";
import { QueryTypes } from "sequelize";

@Route("/api/view/list")
export class ApiTarefa extends Controller {

  @Get("")
  async listar (req: Request, res: Response): Promise<Response> {
    try {
      let sql = `
 SELECT task.id
      , type_id
      , type.name AS type_name
      , label_id
      , label.name AS label_name
      , status_id
      , status.name AS status_name
      , task.name
      , task.description
      , due_date
   FROM task
   LEFT
   JOIN task_type AS type
     ON type.deleted_at IS NULL
    AND type.id = type_id
   LEFT
   JOIN task_label AS label
     ON label.deleted_at IS NULL
    AND label.id = label_id
   LEFT
   JOIN task_status AS status
     ON status.deleted_at IS NULL
    AND status.id = status_id
  WHERE task.deleted_at IS NULL
      `;

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
}

export default ApiTarefa;