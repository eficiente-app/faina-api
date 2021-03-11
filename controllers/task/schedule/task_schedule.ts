import Controller, { Delete, Get, Post, Put, Route } from "@config/controller";
import TaskSchedule from "@models/task/schedule/task_schedule";
import { Request, Response } from "express";
import validate from "validate.js";

/**
 * @export
 *
 * @class Controller
 *
 * @author Eduardo
 *
 * @classdesc Classe Controller responsável pelo cadastro e manutenção de um Cronograma.
 *
 * @extends {TaskScheduleController}
 */
@Route("/api/task/schedule")
export class TaskScheduleController extends Controller {
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
             , user_id
             , type_id
             , start
             , end
             , prior_id
             , next_id
          FROM task_schedule
            `;

    return sql;
  }

  @Get()
  async find (_req: Request, res: Response): Promise<Response> {
    try {
      const sql: string = this.query();

      const TaskSchedule: any = await this.select(sql);

      return res.json(TaskSchedule);
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
        throw new Error("Cronograma inválido.");
      }

      let sql: string = this.query();
      sql += ` WHERE task_schedule.id = :id`;

      const TaskSchedule: any = await this.select(sql, {
        plain: true,
        replacements: {
          id: Number(req.params.id)
        }
      });

      if (validate.isEmpty(TaskSchedule)) {
        throw new Error("Cronograma não encontrado.");
      }

      return res.json(TaskSchedule);
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

      const task_schedule = await TaskSchedule.create(req.body);

      return res.json({
        id: task_schedule.id,
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

      const task_schedule = await TaskSchedule.findByPk(req.body.id);

      if (!task_schedule) this.error.notFoundForUpdate();

      task_schedule.id       = req.body.id;
      task_schedule.task_id  = req.body.task_id;
      task_schedule.user_id  = req.body.user_id;
      task_schedule.type_id  = req.body.type_id;
      task_schedule.start    = req.body.start;
      task_schedule.end      = req.body.end;
      task_schedule.prior_id = req.body.prior_id;
      task_schedule.next_id  = req.body.next_id;

      await task_schedule.save();

      return res.json({
        id: task_schedule.id,
        message: this.message.successUpdate()
      });
    } catch (e) {
      return res.status(500).json({ erro: e.message });
    }
  }

  @Delete("/:id")
  async delete (req: Request, res: Response): Promise<Response> {
    try {
      const task_schedule = await TaskSchedule.findByPk(req.params.id);

      if (!task_schedule) this.error.notFoundForDelete();

      await task_schedule.destroy();

      return res.json({
        id: Number(req.params.id),
        message: this.message.successDelete()
      });
    } catch (e) {
      return res.status(500).json({ erro: e.message });
    }
  }
}

export default TaskScheduleController;
