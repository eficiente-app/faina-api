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

    this.rulesInsert = [];
    this.rulesUpdate = [];
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
        throw new Error("Tarefa inválida.");
      }

      let sql: string = this.query();
      sql += ` WHERE task.id = :id`;

      const Task: any = await this.select(sql, {
        plain: true,
        replacements: {
          id: Number(req.params.id)
        }
      });

      if (validate.isEmpty(Task)) {
        throw new Error("Tarefa não encontrada.");
      }

      return res.json(Task);
    } catch (e) {
      return res.json({
        sucesso: false,
        mensagem: e.message
      });
    }
  }

  @Post()
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
  async update (req: Request, res: Response): Promise<Response> {
    try {
      const erro = validate(req.body, this.rulesUpdate);

      if (erro) return res.status(500).json({ erro });

      const task = await Task.findByPk(req.body.id);

      if (!task) this.error.notFoundForUpdate();

      task.task_id     = req.body.task_id;
      task.type_id     = req.body.type_id;
      task.label_id    = req.body.label_id;
      task.status_id   = req.body.status_id;
      task.name        = req.body.name;
      task.description = req.body.description;
      task.due_date    = req.body.due_date;

      await task.save();

      return res.json({
        id: task.id,
        message: this.message.successUpdate()
      });
    } catch (e) {
      return res.status(500).json({ erro: e.message });
    }
  }

  @Delete("/:id")
  async delete (req: Request, res: Response): Promise<Response> {
    try {
      const task = await Task.findByPk(req.params.id);

      if (!task) this.error.notFoundForDelete();

      await task.destroy();

      return res.json({
        id: Number(req.params.id),
        message: this.message.successDelete()
      });
    } catch (e) {
      return res.status(500).json({ erro: e.message });
    }
  }
}

export default TaskController;
