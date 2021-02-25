import Controller, { Delete, Get, Post, Put, Route } from "@config/controller";
import FolderType from "@models/folder/folder_type";
import { Request, Response } from "express";
import validate from "validate.js";

@Route("/api/folder/type")
export class ApiFolderType extends Controller {
  private readonly validateCreate: any;
  private readonly validateUpdate: any;

  constructor () {
    super();

    this.validateCreate = {
      name: {
        presence: {
          allowEmpty: false,
          message: "^Nome não informado."
        },
        length: {
          maximum: 100,
          tooLong: "^Nome deve ter no máximo %{count} caracteres."
        }
      },
      description: {
        presence: {
          allowEmpty: false,
          message: "^Descrição não informada."
        },
        length: {
          maximum: 1000,
          tooLong: "^Descrição deve ter no máximo %{count} caracteres."
        }
      }
    };

    this.validateUpdate = {
      id: {
        presence: {
          allowEmpty: false,
          message: "^ID não informado."
        },
        numericality: {
          notValid: "^ID inválido."
        }
      },
      ...this.validateCreate
    };
  }

  @Get()
  async find (req: Request, res: Response): Promise<Response> {
    try {
      let sql: string = `
        select id
             , name
             , description
          from folder_type
         where deleted_at is null`;

    if (req.query.name) sql += ` AND name LIKE '%${req.query.name}%'`;
    if (req.query.description) sql += ` AND description LIKE '%${req.query.description}%'`;

      sql += ` limit 1000`;

      const registros = await this.select(sql);

      return res.json(registros);
    } catch (err) {
      return res.status(500).json({
        error: {
          message: err.message,
          type: err.name
        }
      });
    }
  }

  @Get("/:id?")
  async read (req: Request, res: Response): Promise<Response> {
    try {
      const record = await FolderType.findByPk(req.params.id, {
        attributes: ["id", "name", "description"]
      });

      if (!record) {
        this.error.notFoundForRead();
      }

      return res.json(record);
    } catch (err) {
      return res.status(500).json({
        error: {
          message: err.message,
          type: err.name
        }
      });
    }
  }

  @Post()
  async create (req: Request, res: Response): Promise<Response> {
    try {
      const errors = validate(req.body, this.validateCreate);

      if (errors) {
        return res.status(500).json({ errors });
      }

      const record = await FolderType.create(req.body);

      return res.json({
        id: record.id,
        message: this.message.successCreate()
      });
    } catch (err) {
      return res.status(500).json({
        error: {
          message: err.message,
          type: err.name
        }
      });
    }
  }

  @Put()
  async update (req: Request, res: Response): Promise<Response> {
    try {
      const errors = validate(req.body, this.validateUpdate);

      if (errors) {
        return res.status(500).json({ errors });
      }

      const folderType = await FolderType.findByPk(req.body.id);

      if (!folderType) {
        this.error.notFoundForUpdate();
      }

      folderType.name = req.body.name;
      folderType.description = req.body.description;

      await folderType.save();

      return res.json({
        id: folderType.id,
        message: this.message.successUpdate()
      });
    } catch (err) {
      return res.status(500).json({
        error: {
          message: err.message,
          type: err.name
        }
      });
    }
  }

  @Delete("/:id")
  async delete (req: Request, res: Response): Promise<Response> {
    try {
      const record = await FolderType.findByPk(req.params.id);

      if (!record) {
        this.error.notFoundForDelete();
      }

      await record.destroy();

      return res.json({
        id: Number(req.params.id),
        message: this.message.successDelete()
      });
    } catch (err) {
      return res.status(500).json({
        error: {
          message: err.message,
          type: err.name
        }
      });
    }
  }
}

export default ApiFolderType;
