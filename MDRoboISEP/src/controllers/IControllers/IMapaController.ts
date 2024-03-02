import {Request, Response, NextFunction} from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";

export default interface IMapaController {
    exportarMapaParaOPlaneamento(req: Request, res: Response, next: NextFunction);
    carregarMapa(req: Request, res: Response, next: NextFunction);
    exportarMapa(req: Request, res: Response, next: NextFunction);
    exportarMapaAtravesDeUmaPassagemEPiso(req: Request, res: Response, next: NextFunction);
}