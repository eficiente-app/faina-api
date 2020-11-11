import { ROUTE_DECORATOR } from "@config/decorators/constants";

export interface Method {
  methodName: string;
  path: string;
  requestMethod: string;
}

export function path (controllerClass: any): string {
  return Reflect.getMetadata(ROUTE_DECORATOR, controllerClass);
}

export function methods (controllerClass: any): Method[] {
  const methods: Method[] = [ ];

  const properties = Object.getOwnPropertyNames(controllerClass.prototype);

  properties.forEach((property: string) => {
    const metadata = Reflect.getMetadata(ROUTE_DECORATOR, controllerClass.prototype, property);

    if (metadata) methods.push({
      methodName: property,
      path: metadata.path,
      requestMethod: metadata.method
    });
  });

  return methods;
}
