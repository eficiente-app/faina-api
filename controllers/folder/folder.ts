import Controller, { Delete, Get, Post, Put, Route } from "@config/controller";
import Folder from "@models/folder/folder";
import FolderFolder from "@models/folder/folder_folder";
import { Request, Response } from "express";
import validate from "validate.js";

@Route("/api/folder")
export class FolderController extends Controller {
  private readonly validateCreate: any;
  private readonly validateUpdate: any;

  constructor () {
    super();

    this.validateCreate = {
      type_id: {
        presence: {
          allowEmpty: false,
          message: "^Tipo não informado."
        }
      },
      project_id: {
        presence: {
          allowEmpty: false,
          message: "^Projeto não informado."
        }
      },
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
          maximum: 5000,
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
  async find (_req: Request, res: Response): Promise<Response> {
    try {
      const sql = `
        SELECT f.id
             , f.name
             , f.description
             , f.type_id
             , ft.description type
             , f.project_id
             , p.description project
          FROM folder f

         INNER
          JOIN folder_type ft
            ON ft.deleted_at IS NULL
           AND ft.id = f.type_id

         INNER
          JOIN project p
            ON p.deleted_at IS NULL
           AND p.id = f.project_id

         WHERE f.deleted_at IS NULL`;

      const folders: any = await this.select(sql);

      return res.json(folders);
    } catch (err) {
      return res.status(500).json({
        error: {
          message: err.message,
          type: err.name
        }
      });
    }
  }

  @Get("/:id")
  async read (req: Request, res: Response): Promise<Response> {
    try {
      const record = await Folder.findByPk(req.params.id, {
        attributes: ["id", "name", "description", "type_id", "project_id"]
      });

      if (!record) this.error.notFoundForRead();

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

      const { type_id, project_id, name, description, folder_id } = req.body;

      let folder: any;
      await this.faina().transaction(async (t) => {

        folder = await Folder.create({
          type_id: type_id,
          project_id: project_id,
          description: description,
          name: name
        }, {
          transaction: t
        });

        // Inserir o Relacionamento da Pasta com a Pasta Mãe
        if (!validate.isEmpty(folder_id)) {
          await FolderFolder.create({
            parent_id: folder.id,
            folder_id: folder_id
          }, {
            transaction: t
          });
        }

      });

    return res.json({
      folderId: folder.id,
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

      const { type_id, project_id, name, description, folder_id, folder_idNew } = req.body;

      const folder = await Folder.findByPk(req.body.id);

      if (!folder) {
        this.error.notFoundForUpdate();
      }

      folder.type_id = type_id;
      folder.project_id = project_id;
      folder.description = description;
      folder.name = name;

      await this.faina().transaction(async (t) => {
        await folder.save({ transaction: t });

        if (!validate.isEmpty(folder_idNew)) {
          const folderFolder = await FolderFolder.findOne({
            where: {
              parent_id: req.body.id,
              folder_id: folder_id
            }
          });

          if (folderFolder) {
            folderFolder.folder_id = folder_idNew;
            await folderFolder.save({ transaction: t });
          }
        }
      });

      return res.json({
        id: folder.id,
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
      const record = await Folder.findByPk(req.params.id);

      if (!record) this.error.notFoundForDelete();

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

export default FolderController;
