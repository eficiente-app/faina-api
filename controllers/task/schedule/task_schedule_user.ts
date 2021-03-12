import Controller, { Delete, Get, Post, Put, Route } from "@config/controller";
import TaskScheduleUser from "@models/task/schedule/task_schedule_user";
import { Request, Response } from "express";
import validate from "validate.js";

/**
 * @export
 *
 * @class Controller
 *
 * @author Eduardo
 *
 * @classdesc Classe Controller responsável pelo cadastro e manutenção de um Cronograma do Usuário.
 *
 * @extends {TaskScheduleUserController}
 */
@Route("/api/task/schedule/user")
export class TaskScheduleUserController extends Controller {
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
             , schedule_id
             , user_id
             , requiered
             , confirm
          FROM task_schedule_user
            `;

    return sql;
  }

  @Get()
  async find (_req: Request, res: Response): Promise<Response> {
    try {
      const sql: string = this.query();

      const TaskScheduleUser: any = await this.select(sql);

      return res.json(TaskScheduleUser);
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
        throw new Error("Cronograma de usuário inválido.");
      }

      let sql: string = this.query();
      sql += ` WHERE task_schedule_user.id = :id`;

      const TaskScheduleUser: any = await this.select(sql, {
        plain: true,
        replacements: {
          id: Number(req.params.id)
        }
      });

      if (validate.isEmpty(TaskScheduleUser)) {
        throw new Error("Cronograma de usuário não encontrado.");
      }

      return res.json(TaskScheduleUser);
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

      const task_schedule_user = await TaskScheduleUser.create(req.body);

      return res.json({
        id: task_schedule_user.id,
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

      const task_schedule_user = await TaskScheduleUser.findByPk(req.body.id);

      if (!task_schedule_user) this.error.notFoundForUpdate();

      task_schedule_user.id          = req.body.id;
      task_schedule_user.schedule_id = req.body.schedule_id;
      task_schedule_user.user_id     = req.body.user_id;
      task_schedule_user.requiered   = req.body.requiered;
      task_schedule_user.confirm     = req.body.confirm;

      await task_schedule_user.save();

      return res.json({
        id: task_schedule_user.id,
        message: this.message.successUpdate()
      });
    } catch (e) {
      return res.status(500).json({ erro: e.message });
    }
  }

  @Delete("/:id")
  async delete (req: Request, res: Response): Promise<Response> {
    try {
      const task_schedule_user = await TaskScheduleUser.findByPk(req.params.id);

      if (!task_schedule_user) this.error.notFoundForDelete();

      await task_schedule_user.destroy();

      return res.json({
        id: Number(req.params.id),
        message: this.message.successDelete()
      });
    } catch (e) {
      return res.status(500).json({ erro: e.message });
    }
  }
}

export default TaskScheduleUserController;
