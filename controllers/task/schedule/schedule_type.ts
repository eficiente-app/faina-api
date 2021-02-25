import Controller, { Delete, Get, Post, Put, Route } from "@config/controller";
import ScheduleType from "@models/task/schedule/schedule_type";
import { Request, Response } from "express";
import validate from "validate.js";

@Route("/api/task/schedule/type")
export class ApiScheduleType extends Controller {
  protected readonly rulesInsert: any;
  protected readonly rulesUpdate: any;

  constructor () {
    super();

    this.rulesInsert = this.rules([
      "name",
      "description"
    ]);

    this.rulesUpdate = Object.assign(this.rules(["id"]), this.rulesInsert);
  }

  @Get("/")
  async find (req: Request, res: Response): Promise<Response> {
    try {
      let sql: string = `
        select id
             , name
             , description
          from schedule_type
         where deleted_at is null`;

    if (req.query.name) sql += ` AND name LIKE '%${req.query.name}%'`;
    if (req.query.description) sql += ` AND description LIKE '%${req.query.description}%'`;

      sql += ` limit 1000`;

      const registros = await this.select(sql);

      return res.json(registros);
    } catch (e) {
      return res.status(500).json({ erro: e.message });
    }
  }

  @Get("/:id?")
  async read (req: Request, res: Response): Promise<Response> {
    try {
      const record = await ScheduleType.findByPk(req.params.id, {
        attributes: ["id", "name", "description"]
      });

      if (!record) {
        this.error.notFoundForRead();
      }

      return res.json(record);
    } catch (e) {
      return res.status(500).json({ erro: e.message });
    }
  }

  @Post("")
  async create (req: Request, res: Response): Promise<Response> {
    try {
      const erro = validate(req.body, this.rulesInsert);

      if (erro) return res.status(500).json({ erro });

      const scheduleType = await ScheduleType.create(req.body);

      return res.json({
        id: scheduleType.id,
        message: this.message.successCreate()
      });
    } catch (e) {
      return res.status(500).json({ erro: e.message });
    }
  }

  @Put("")
  async update (req: Request, res: Response): Promise<Response> {
    try {
      const erro = validate(req.body, this.rulesUpdate);

      if (erro) return res.status(500).json({ erro });

      const scheduleType = await ScheduleType.findByPk(req.body.id);

      if (!scheduleType) this.error.notFoundForUpdate();

      scheduleType.name = req.body.name;
      scheduleType.description = req.body.description;

      await scheduleType.save();

      return res.json({
        id: scheduleType.id,
        message: this.message.successUpdate()
      });
    } catch (e) {
      return res.status(500).json({ erro: e.message });
    }
  }

  @Delete("/:id")
  async delete (req: Request, res: Response): Promise<Response> {
    try {
      const scheduleType = await ScheduleType.findByPk(req.params.id);

      if (!scheduleType) this.error.notFoundForDelete();

      await scheduleType.destroy();

      return res.json({
        id: Number(req.params.id),
        message: this.message.successDelete()
      });
    } catch (e) {
      return res.status(500).json({ erro: e.message });
    }
  }
}

export default ApiScheduleType;
