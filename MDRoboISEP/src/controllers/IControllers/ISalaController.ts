import { NextFunction, Request, Response } from "express";

export default interface ISalaController{
    criarSala(req: Request, res: Response, next:NextFunction);
}