import { Request, Response, NextFunction } from 'express';

export default interface IPisoController  {
  listarPisosComMapa(req: Request, res: Response, next: NextFunction);
  criarPiso(req: Request, res: Response, next: NextFunction);
  listarTodosOsPisosDeUmEdificio(req: Request, res: Response, next: NextFunction);
  editarPiso(req: Request, res: Response, next: NextFunction);
  listarPisosServidosPorElevador(req: Request, res: Response, next: NextFunction);
}