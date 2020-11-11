import * as controllerLoader from "@config/router/loader";
import express from "express";
import glob from "glob";
import path from "path";

async function createRouter (controllerPath: string, server: express.Express): Promise<void> {
  const ControllerClass = (await import(controllerPath)).default;

  if (ControllerClass) {
    const controllerPath = controllerLoader.path(ControllerClass);

    if (controllerPath) {
      const methods = controllerLoader.methods(ControllerClass);

      if (methods.length) {
        const router = express.Router();
        const controller = new ControllerClass();

        methods.forEach((method: controllerLoader.Method) => {
          (<any>router)[method.requestMethod](method.path, controller[method.methodName].bind(controller));
        });

        server.use(controllerPath, router);
      }
    }
  }
}

export default async function (server: express.Express) {
  const controllersPath = path.join(path.resolve("./"), "/dist/controllers/**/*js");

  return new Promise((resolve: any, reject: any) => {
    glob(controllersPath, async (err: Error, controllers: string[]) => {
      if (err) reject(err);

      for (let index = 0; index < controllers.length; index++) {
        await createRouter(controllers[index], server);
      }

      resolve();
    });
  });
}
