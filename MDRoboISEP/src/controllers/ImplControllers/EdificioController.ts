import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from "../../../config";
import { Result } from "../../core/logic/Result";
import IEdificioController from '../IControllers/IEdificioController';
import IEdificioService from '../../services/IServices/IEdificioService';
import IEdificioDTO from '../../dto/IEdificioDTO';
import IListarEdMinEMaxPisosDTO from '../../dto/IListarEdMinEMaxPisosDTO';
import IPlaneamentoCaminhosDTO from '../../dto/IPlaneamentoCaminhosDTO';
import ICoordenadasPontosDTO from '../../dto/ICoordenadasPontosDTO';
import IAuthService from '../../services/IServices/IAuthService';
@Service()
export default class EdificioController implements IEdificioController /* TODO: extends ../core/infra/BaseController */ {
  constructor(
      @Inject(config.services.edificio.name) private edificioServiceInstance : IEdificioService,
      @Inject(config.services.auth.name) private authServiceInstance : IAuthService
  ) {}
  public async getInformacaoPlaneamento(req: Request, res: Response, next: NextFunction) {
    try{
      let authOrError = this.authServiceInstance.checkAuth(req, res, ['gestor de campus', 'gestor de frota', 'gestor de tarefas']);
      if(authOrError.isFailure){
        return res.send();
      }
      let props: ICoordenadasPontosDTO = {
        x_origem: Number(req.body.x_origem),
        y_origem: Number(req.body.y_origem),
        piso_origem: req.body.piso_origem as string,
        x_destino: Number(req.body.x_destino),
        y_destino: Number(req.body.y_destino),
        piso_destino: req.body.piso_destino as string
      };

      const edificioOrError = await this.edificioServiceInstance.getInformacaoPlaneamento(props) as Result<IPlaneamentoCaminhosDTO>;
      if (edificioOrError.isFailure) {
        res.status(400);
        return res.json(edificioOrError.errorValue());
      }
      const edificioDTO = edificioOrError.getValue();
      res.status(200);
      return res.json( edificioDTO );
    }
    catch(e){
      return next(e);
    }
  }

  public async criarEdificio(req: Request, res: Response, next: NextFunction) {
    try{
      let authOrError = this.authServiceInstance.checkAuth(req, res, ['gestor de campus']);
      if(authOrError.isFailure){
        return res.send();
      }
      const edificioOrError = await this.edificioServiceInstance.criarEdificio(req.body as IEdificioDTO) as Result<IEdificioDTO>;
      if (edificioOrError.isFailure) {
        res.status(400);
        return res.json(edificioOrError.errorValue());
      }
      const edificioDTO = edificioOrError.getValue();
      res.status(201);
      return res.json( edificioDTO ).send();
    }catch(e){
      return next(e);
    }
  }

  
  public async listarEdificioMinEMaxPisos(req: Request, res: Response, next: NextFunction) {
    try{
      let authOrError = this.authServiceInstance.checkAuth(req, res, ['gestor de campus']);
      if(authOrError.isFailure){
        return res.send();
      }
      let props ={ minPisos: Number(req.query.minPisos), maxPisos: Number(req.query.maxPisos) };
      const edificioOrError = await this.edificioServiceInstance.listarEdificioMinEMaxPisos(props as IListarEdMinEMaxPisosDTO) as Result<IEdificioDTO[]>;
      if (edificioOrError.isFailure) {
        if(String(edificioOrError.errorValue()) === "Não existem edificios com o número de pisos pretendido"){
          res.status(404);
          return res.json(edificioOrError.errorValue());
        }
        res.status(400);
        return res.json(edificioOrError.errorValue());
      }
      const edificioDTO = edificioOrError.getValue();
      res.status(200);
      return res.json( edificioDTO );
    }catch(e){
      return next(e);
    }
  }

  public async listarEdificios(req: Request, res: Response, next: NextFunction) {
    try{
      let authOrError = this.authServiceInstance.checkAuth(req, res, ['gestor de campus', 'gestor de frota', 'gestor de tarefas', 'utente']);
      if(authOrError.isFailure){
        return res.send();
      }
      const listaEdificiosOrError = await this.edificioServiceInstance.listarEdificios() as Result<IEdificioDTO[]>;
      if (listaEdificiosOrError.isFailure) {
        if(String(listaEdificiosOrError.errorValue()) === "Não existem edificios"){
          res.status(404);
        }else{
          res.status(400);
        }
        return res.json(listaEdificiosOrError.errorValue());
      }
      const listaEdificiosDTO = listaEdificiosOrError.getValue();
      return res.json( listaEdificiosDTO ).status(200);
    }catch(e){
    return next(e);
    }
  }

  public async editarEdificio(req: Request, res: Response, next: NextFunction){
    try{
      let authOrError = this.authServiceInstance.checkAuth(req, res, ['gestor de campus']);
      if(authOrError.isFailure){
        return res.send();
      }
      const edificioOrError = await this.edificioServiceInstance.editarEdificio(req.body as IEdificioDTO) as Result<IEdificioDTO>;
      if (edificioOrError.isFailure) {
        if(String(edificioOrError.errorValue()) === "Edificio não existe"){
          res.status(404);
        }else{
          res.status(400);
        }
        return res.json(edificioOrError.errorValue());
      }
      const edificioDTO = edificioOrError.getValue();
      return res.json( edificioDTO );
    }catch(e){
      throw next(e);
    }
  }

  public async deleteEdificio(req: Request, res: Response, next: NextFunction){
    try{
      let authOrError = this.authServiceInstance.checkAuth(req, res, ['gestor de campus']);
      if(authOrError.isFailure){
        return res.send();
      }
      let props = req.query.codEdificio as string;
      const edificioOrError = await this.edificioServiceInstance.deleteEdificio(props) as Result<IEdificioDTO>;
      if (edificioOrError.isFailure) {
        res.status(402);
        return res.json(edificioOrError.errorValue());
      }
      const edificioDTO = edificioOrError.getValue();
      return res.json( edificioDTO );
    }catch(e){
      throw next(e);
    }
  }
}