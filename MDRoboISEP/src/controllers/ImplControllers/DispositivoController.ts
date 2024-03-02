import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from "../../../config";
import { Result } from "../../core/logic/Result";
import IDispositivoController from '../IControllers/IDispositivoController';
import IDispositivoDTO from '../../dto/IDispositivoDTO';
import IDispositivoService from '../../services/IServices/IDispositivoService';
import IAdicionarRoboAFrotaDTO from '../../dto/IAdicionarRoboAFrotaDTO';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import IDispositivoInibirDTO from '../../dto/IDispositivoInibirDTO';
import ICodigoDosDispositivosPorTarefaDTO from '../../dto/ICodigoDosDispositivosPorTarefaDTO';
import IAuthService from '../../services/IServices/IAuthService';
@Service()
export default class DispositivoController implements IDispositivoController {
  constructor(
      @Inject(config.services.dispositivo.name) private dispositivoServiceInstance : IDispositivoService,
      @Inject(config.services.auth.name) private authServiceInstance : IAuthService

  ) {}
  public async inibirDispositivo(req: Request, res: Response, next: NextFunction) {
    try{
      let authOrError = this.authServiceInstance.checkAuth(req, res, ['gestor de frota']);
      if(authOrError.isFailure){
        return res.send();
      }
      const dispositivoOrError = await this.dispositivoServiceInstance.inibirDispositivo(req.body as IDispositivoInibirDTO);
      if (dispositivoOrError.isFailure) {
        let message = String(dispositivoOrError.errorValue());
        if (message === "O dispositivo com o codigo " + req.body.codigo +" não existe") {
          res.status(404);
          return res.json(dispositivoOrError.errorValue());
        }
        return res.status(402).json(dispositivoOrError.errorValue());
      }
      const dispositivoDTO = dispositivoOrError.getValue();
      res.status(200);
      return res.json( dispositivoDTO );
    }catch(e){
      return next(e);
    }
  }

  public async adicionarDispositivoAFrota(req: Request, res: Response, next: NextFunction) {
    try{
      let authOrError = this.authServiceInstance.checkAuth(req, res, ['gestor de frota']);
      if(authOrError.isFailure){
        return res.send();
      }
      const dispositivoOrError = await this.dispositivoServiceInstance.adicionarDispositivoAFrota(req.body as IAdicionarRoboAFrotaDTO) as Result<IDispositivoDTO>;
      if (dispositivoOrError.isFailure) {
          if(String(dispositivoOrError.errorValue()) === "O tipo de dispositivo com o id " + req.body.tipoDispositivo +" não existe"){
            res.status(404);
            return res.json(dispositivoOrError.errorValue());
          }
        res.status(400);
        return res.json(dispositivoOrError.errorValue());
      }
      const dispositivoDTO = dispositivoOrError.getValue();
      res.status(201);
      return res.json( dispositivoDTO );
    }catch(e){
      return next(e);
    }
  }

  public async listarDispositivosDaFrota(req: Request, res: Response, next: NextFunction) {
    try{
      let authOrError = this.authServiceInstance.checkAuth(req, res, ['gestor de frota']);
      if(authOrError.isFailure){
        return res.send();
      }
      const dispositivoOrError = await this.dispositivoServiceInstance.listarDispositivosDaFrota() as Result<IDispositivoDTO[]>;
      
      if (dispositivoOrError.isFailure) {
        res.status(400);
        return res.json(dispositivoOrError.errorValue());
      }
      
      const dispositivoDTO = dispositivoOrError.getValue();
      res.status(200);
      return res.json(dispositivoDTO);
      
    }catch(e){
      return next(e);
    }
  }

  public async listarCodigoDosDispositivosDaFrotaPorTarefa(req: Request, res: Response, next: NextFunction) {
    try{
      let authOrError = this.authServiceInstance.checkAuth(req, res, ['gestor de tarefas']);
      if(authOrError.isFailure){
        return res.send();
      }
      const dispositivoOrError = await this.dispositivoServiceInstance.listarCodigoDosDispositivosDaFrotaPorTarefa() as Result<ICodigoDosDispositivosPorTarefaDTO>;
      
      if (dispositivoOrError.isFailure) {
        if(String(dispositivoOrError.errorValue()) === "Não existem dispositivos na frota"){
          res.status(404);
          return res.json(dispositivoOrError.errorValue());
        }
        res.status(400);
        return res.json(dispositivoOrError.errorValue());
      }
      
      const dispositivoDTO = dispositivoOrError.getValue();
      res.status(200);
      return res.json(dispositivoDTO);
      
    }catch(e){
      return next(e);
    }
  }
}