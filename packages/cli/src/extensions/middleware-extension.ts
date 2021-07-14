import { MiddlewareHandler } from "../lib/middleware";
import { DockerAccessMiddleware } from "../lib/middleware/DockerAccessMiddleware";

import { GluegunToolbox } from "gluegun";

module.exports = (toolbox: GluegunToolbox): void => {
  toolbox.middleware = new MiddlewareHandler(
    new DockerAccessMiddleware()
  );
};
