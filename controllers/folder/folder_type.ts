import Controller, { Delete, Get, Post, Put, Route } from "@config/controller";
import { Request, Response } from "express";
import { QueryTypes } from "sequelize";

@Route("/api/folder-type")
export class FolderTypeController extends Controller {
  @Get()
  async find (_req: Request, res: Response): Promise<Response> {
    try {
      const sql = `
        SELECT ft.id
             , ft.name
             , ft.description
          FROM folder_type ft

         WHERE ft.deleted_at IS NULL`;

      const folderTypes: any = await this.select(sql);

      return res.json(folderTypes);
    } catch (e) {
      return res.json({
        status: false,
        message: e.message
      });
    }
  }

  @Get("/:id")
  async read (req: Request, res: Response): Promise<Response> {
    try {
      const sql = `
        SELECT ft.id
             , ft.name
             , ft.description
          FROM folder_type ft

         WHERE ft.deleted_at IS NULL
           AND ft.id = :id`;

      const folderType: any = await this.select(sql, {
        plain: true,
        replacements: {
          id: Number(req.params.id)
        }
      });

      return res.json(folderType);
    } catch (e) {
      return res.json({
        status: false,
        message: e.message
      });
    }
  }

  @Post()
  async create (req: Request, res: Response): Promise<Response> {
    try {
      let folderType: any = {};

      await this.faina().transaction(async (t) => {
        const register = await this.select(`
          INSERT
            INTO folder_type
               ( name
               , description
               )
          VALUES
               ( :name
               , :description
               );`, {
          replacements: {
            name: req.body.name,
            description: req.body.description
          },
          transaction: t,
          type: QueryTypes.INSERT
        });

        folderType = register;
      });

      return res.json({
        folderType
      });
    } catch (e) {
      return res.json({
        status: false,
        message: e.message
      });
    }
  }

  @Put()
  async update (req: Request, res: Response): Promise<Response> {
    try {
      let folderType: any = {};

      await this.faina().transaction(async (t) => {
        const register = await this.select(`
          UPDATE folder_type
             SET name = :name
               , description = :description
           WHERE deleted_at IS NULL
             AND id = :id`, {
          replacements: {
            id: req.body.id,
            name: req.body.name,
            description: req.body.description
          },
          transaction: t,
          type: QueryTypes.UPDATE
        });

        folderType = register[1]
      });

      return res.json({
        folderType
      });
    } catch (e) {
      return res.json({
        status: false,
        message: e.message
      });
    }
  }

  @Delete("/:id")
  async delete (req: Request, res: Response): Promise<Response> {
    try {
      const register: any = await this.select(`
        UPDATE folder_type
           SET deleted_at  = CURRENT_TIMESTAMP()
             , deleted_by  = :user_id
         WHERE id           = ${req.params.id}
           AND deleted_at IS NULL
      `, {
        replacements: {
          user_id: 0
        },
        type: QueryTypes.UPDATE
      });

      await register.destroy();

      return res.json(register[1]);
    } catch (e) {
      return res.json({
        status: false,
        message: e.message
      });
    }
  }
}

export default FolderTypeController;
