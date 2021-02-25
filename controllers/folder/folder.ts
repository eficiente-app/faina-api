import Controller, { Delete, Get, Post, Put, Route } from "@config/controller";
import Folder from "@models/folder/folder";
import { Request, Response } from "express";
import { QueryTypes } from "sequelize";
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

  @Get("/")
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
      // FIX-ME: Definir validações de formulário.
      const errors = validate(req.body, this.validateCreate);

      if (errors) {
        return res.status(500).json({ errors });
      }

      const parameters: Array<any> = this.toArray(req.body);
      const folder: Array<any> = [];
      const folderFolder: Array<any> = [];

      await this.faina().transaction(async (t) => {
        for (let i = 0; i < parameters.length; i++) {
          const register = await this.select(`
            INSERT
              INTO folder
                 ( type_id
                 , project_id
                 , name
                 , description
                 )
            VALUES
                 ( :type_id
                 , :project_id
                 , :name
                 , :description
                 );`, {
            replacements: {
              type_id: parameters[i].type_id,
              project_id: parameters[i].project_id,
              name: parameters[i].name,
              description: parameters[i].description
            },
            transaction: t,
            type: QueryTypes.INSERT
          });

          folder.push(register[0]);

          if (parameters[i].folder_id) {
            const registerFolder = await this.select(`
              /* Inserir o Relacionamento da Pasta com a Pasta Mãe */
              INSERT
                INTO folder_folder
                   ( parent_id
                   , folder_id
                   )
              SELECT LAST_INSERT_ID()
                   , folder.id
                FROM folder
               WHERE folder.id = ${parameters[i].folder_id};
            `, {
              transaction: t,
              type: QueryTypes.INSERT
            });

            folderFolder.push(registerFolder[0]);
          }
        }
      });

      return res.json({
        folder,
        folderFolder
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

      const parameters: Array<any> = this.toArray(req.body);
      const folder: Array<any> = [];
      const folderFolder: Array<any> = [];

      await this.faina().transaction(async (t) => {
        for (let i = 0; i < parameters.length; i++) {
          const register = await this.select(`
            /* Altera informações sobre a pasta */
            UPDATE folder
               SET type_id     = :type_id
                 , project_id  = :project_id
                 , name        = :name
                 , description = :description
             WHERE deleted_at IS NULL
               AND id = :id`, {
            replacements: {
              id: parameters[i].id,
              type_id: parameters[i].type_id,
              project_id: parameters[i].project_id,
              name: parameters[i].name,
              description: parameters[i].description
            },
            transaction: t,
            type: QueryTypes.UPDATE
          });

          folder.push(register[1]);

          if (parameters[i].folder_id && parameters[i].folder_idNew) {
            const registerFolder = await this.select(`
                  /* Altera o Relacionamento da Pasta com a Pasta Mãe */
              UPDATE folder_folder
                 SET parent_id = ${parameters[i].folder_idNew}
               WHERE parent_id = ${parameters[i].id}
                 AND folder_id = ${parameters[i].pasta_id};`, {
              type: QueryTypes.UPDATE,
              transaction: t
            });

            folderFolder.push(registerFolder[1]);
          }
        }
      });

      return res.json({
        folder,
        folderFolder
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
