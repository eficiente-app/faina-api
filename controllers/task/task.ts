import Controller, { Delete, Get, Post, Put, Route } from "@config/controller";
import Task from "@models/task/task";
import { Request, Response } from "express";
import validate from "validate.js";

/**
 * @export
 *
 * @class Controller
 *
 * @author Eduardo
 *
 * @classdesc Classe Controller responsável pelo cadastro e manutenção de uma Tarefa.
 *
 * @extends {TaskController}
 */
@Route("/api/task")
export class TaskController extends Controller {
  protected readonly rulesInsert: any;
  protected readonly rulesUpdate: any;

  constructor () {
    super();

    this.rulesInsert = this.rules([
      "task_id",
      "type_id",
      "label_id",
      "status_id",
      "name",
      "description",
      "due_date"
    ]);

    this.rulesUpdate = Object.assign(this.rules(["id"]), this.rulesInsert);
  }

  protected query (): string {
    const sql: string = `
        SELECT id
             , task_id
             , type_id
             , label_id
             , status_id
             , name
             , description
             , due_date
          FROM task 
            `;

    return sql;
  }

  @Get()
  async find (_req: Request, res: Response): Promise<Response> {
    try {
      const sql: string = this.query();

      const Tasks: any = await this.select(sql);

      return res.json(Tasks);
    } catch (e) {
      return res.json({
        sucesso: false,
        mensagem: e.message
      });
    }
  }

  @Get("/:id")
  async read (req: Request, res: Response): Promise<Response> {
    try {
      const { id }: any = req.params;

      if (isNaN(id)) {
        throw new Error("Task inválido.");
      }

      let sql: string = this.query();
      sql += ` AND p.id = :id`;

      const Task: any = await this.select(sql, {
        plain: true,
        replacements: {
          id: Number(req.params.id)
        }
      });

      if (validate.isEmpty(Task)) {
        throw new Error("Task não encontrado.");
      }

      return res.json(Task);
    } catch (e) {
      return res.json({
        sucesso: false,
        mensagem: e.message
      });
    }
  }

  @Post("")
  async create (req: Request, res: Response): Promise<Response> {
    try {
      const erro = validate(req.body, this.rulesInsert);

      if (erro) return res.status(500).json({ erro });

      const task = await Task.create(req.body);

      return res.json({
        id: task.id,
        message: this.message.successCreate()
      });
    } catch (e) {
      return res.status(500).json({ erro: e.message });
    }
  }

  @Put()
  async update (_req: Request, res: Response): Promise<Response> {
    try {

    } catch (e) {
      return res.json({
        sucesso: false,
        mensagem: e.message
      });
    }
  }

  @Delete("/:id")
  async delete (_req: Request, res: Response): Promise<Response> {
    try {

    } catch (e) {
      return res.json({
        sucesso: false,
        mensagem: e.message
      });
    }
  }
}

export default TaskController;