import Controller, { Delete, Get, Post, Put, Route } from "@config/controller";
import ProjectType from "@models/project/project_type";
import { Request, Response } from "express";
import validate from "validate.js";

@Route("/api/project/type")
export class ApiProjectType extends Controller {
  protected readonly rulesInsert: any;
  protected readonly rulesUpdate: any;

  constructor () {
    super();

    this.rulesInsert = [];
    this.rulesUpdate = [];
  }

  @Get("/")
  async find (req: Request, res: Response): Promise<Response> {
    try {
      let sql: string = `
        select id
             , name
             , description
          from project_type
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
      const record = await ProjectType.findByPk(req.params.id, {
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

      const projectType = await ProjectType.create(req.body);

      return res.json({
        id: projectType.id,
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

      const projectType = await ProjectType.findByPk(req.body.id);

      if (!projectType) this.error.notFoundForUpdate();

      projectType.name = req.body.name;
      projectType.description = req.body.description;

      await projectType.save();

      return res.json({
        id: projectType.id,
        message: this.message.successUpdate()
      });
    } catch (e) {
      return res.status(500).json({ erro: e.message });
    }
  }

  @Delete("/:id")
  async delete (req: Request, res: Response): Promise<Response> {
    try {
      const projectType = await ProjectType.findByPk(req.params.id);

      if (!projectType) this.error.notFoundForDelete();

      await projectType.destroy();

      return res.json({
        id: Number(req.params.id),
        message: this.message.successDelete()
      });
    } catch (e) {
      return res.status(500).json({ erro: e.message });
    }
  }
}

export default ApiProjectType;
