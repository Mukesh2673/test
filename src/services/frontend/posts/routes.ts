import { Request, Response } from "express";
import {
  get,
  registerPage,
} from "./controller";
import config from "config";
const basePath = config.get("BASE_PATH");
const currentPath = "test";
const currentPathURL = basePath + currentPath;
export default [
  
  {
    path: currentPathURL,
    method: "post",
    handler: [
      async (req: Request, res: Response) => {
        const result = await get(req.get(config.get('AUTHORIZATION')), req.body.email);
        res.status(200).send(result);
      }
    ]
  },

  {
    path: currentPathURL,
    method: "get",
    handler: [
      async (req: Request, res: Response) => {
        const result = await registerPage(req.query);
        res.status(200).send(result);
      }
    ]
  }

];
