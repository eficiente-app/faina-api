import Controller, { Delete, Get, Post, Put, Route } from "@config/controller";
import Project from "@models/project";
import { Request, Response } from "express";
import { assign } from "lodash";
import validate from "validate.js";

@Route("/api/project")
export class ProjectController extends Controller {
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
      },
      start: {
        datetime: {
          message: "^Data inicial inválida."
        }
      },
      end: {
        datetime: {
          message: "^Data final inválida."
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

  private async rules (body: any, params: any): Promise<any> {
    let errors: any;

    // FIX-ME: Validar tipo do projeto.

    try {
      await validate.async(body, params);
    } catch (err) {
      console.log(err)
      errors = assign(err, errors);
    }

    return errors;
  }

  @Get()
  async find (_req: Request, res: Response): Promise<Response> {
    try {
      const sql: string = `
        SELECT p.id
             , p.name
             , p.description
             , p.type_id
             , pt.description type
             , p.start
             , p.end
          FROM project p

         INNER
          JOIN project_type pt
            ON pt.deleted_at IS NULL
           AND pt.id = p.type_id

         WHERE p.deleted_at IS NULL`;

      const projects = await this.select(sql);

      return res.json(projects);
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
      const sql: string = `
        SELECT p.id
             , p.name
             , p.description
             , p.type_id
             , p.start
             , p.end
          FROM project p

         WHERE p.deleted_at IS NULL
           AND p.id = :id`;

      const project = await this.select(sql, {
        plain: true,
        replacements: {
          id: Number(req.params.id)
        }
      });

      return res.json(project);
    } catch (err) {
      return res.json({
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
      const errors = await this.rules(req.body, this.validateCreate);

      if (errors) {
        return res.json({ errors });
      }

      const project = Project.build(req.body);

      await project.save();

      return res.json({
        message: "Projeto cadastrado com sucesso.",
        id: project.id
      });
    } catch (err) {
      return res.json({
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
      const errors = await this.rules(req.body, this.validateUpdate);

      if (errors) {
        return res.json({ errors });
      }

      const {
        id,
        description,
        name,
        type_id,
        start,
        end
      }: any = req.body;

      const project = await Project.findByPk(id);

      if (validate.isEmpty(project)) {
        throw new Error("Projeto não encontrado.");
      }

      await project.update({
        description: description,
        name: name,
        type_id: type_id,
        start: start,
        end: end
      });

      return res.json({
        message: "Projeto editado com sucesso.",
        id: project.id
      });
    } catch (err) {
      return res.json({
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
      const project = await Project.findByPk(req.params.id);

      if (validate.isEmpty(project)) {
        throw new Error("Projeto não encontrado.");
      }

      // FIX-ME: Configurar soft delete
      await project.destroy();

      return res.json({
        message: "Projeto excluído com sucesso.",
        id: project.id
      });
    } catch (err) {
      return res.json({
        error: {
          message: err.message,
          type: err.name
        }
      });
    }
  }
}

export default ProjectController;
