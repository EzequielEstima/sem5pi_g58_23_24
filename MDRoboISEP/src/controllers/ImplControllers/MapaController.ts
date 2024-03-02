import {Request, Response, NextFunction} from "express";
import IMapaController from "../IControllers/IMapaController";
import IMapaService from "../../services/IServices/IMapaService";
import config from "../../../config";
import { Inject, Service } from "typedi";
import ICarregarMapaDTO from "../../dto/ICarregarMapaDTO";
import { Result } from "../../core/logic/Result";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import IExportarMapaDTO from "../../dto/IExportarMapaDTO";
import IAuthService from "../../services/IServices/IAuthService";
@Service()
export default class MapaController implements IMapaController {
    constructor(
        @Inject(config.services.mapa.name) private mapaServiceInstance : IMapaService,
        @Inject(config.services.auth.name) private authServiceInstance : IAuthService
    ) {}
    
    public async carregarMapa(req: Request, res: Response, next: NextFunction) {
        try{
            let authOrError = this.authServiceInstance.checkAuth(req, res, ['gestor de campus']);
            if(authOrError.isFailure){
              return res.send();
            }
            let mapaOrError = await this.mapaServiceInstance.carregarMapa(req.body as ICarregarMapaDTO);
            if(mapaOrError.isFailure){
                let erro = String(mapaOrError.errorValue());
                if(erro === "O Edifício que inseriu não existe." || erro === "O piso que inseriu não existe." ||
                erro === "Não existem passagens que satisfaçam os dados inseridos" ||
                erro === "Não existem salas que satisfaçam os dados inseridos" ||
                erro === "Não existe elevador neste edifício."){
                    res.status(404);
                }else{
                    res.status(400);
                }
                return res.json(mapaOrError.errorValue());
            }
            const mapaDTO = mapaOrError.getValue();
            res.status(201);
            return res.json(mapaDTO).send();
        }catch(e){
            return next(e);
        }
    }
    public async exportarMapa(req: Request, res: Response, next: NextFunction) {
        try{
            let authOrError = this.authServiceInstance.checkAuth(req, res, ['gestor de campus', 'gestor de frota', 'gestor de tarefas', 'utente', 'admin']);
            if(authOrError.isFailure){
              return res.send();
            }
            let mapaOrError = await this.mapaServiceInstance.exportarMapa({codigoEdificio:req.query.codEdificio as string,
                    numeroPiso: +(req.query.numPiso as string)}as IExportarMapaDTO);
            if(mapaOrError.isFailure){
                let erro = String(mapaOrError.errorValue());
                if(erro === "O Edifício que inseriu não existe." || erro === "O piso que inseriu não existe."){
                    res.status(404);
                }else{
                    res.status(400);
                }
                return res.json(mapaOrError.errorValue());
            }
            const mapaDTO = mapaOrError.getValue();
            res.status(200);
            return res.json(mapaDTO);
        }catch(e){
            return next(e);
        }
    }

    public async exportarMapaAtravesDeUmaPassagemEPiso(req: Request, res: Response, next: NextFunction) {
        try{
            let authOrError = this.authServiceInstance.checkAuth(req, res, ['gestor de campus', 'gestor de frota', 'gestor de tarefas', 'utente', 'admin']);
            if(authOrError.isFailure){
              return res.send();
            }
            let idPassagem = req.query.idPassagem as unknown as number;
            let codEd = req.query.codEd as string;
            let numeroPiso = req.query.numeroPiso as unknown as number;
            let mapaOrError = await this.mapaServiceInstance.exportarMapaAtravesDeUmaPassagemEPiso(idPassagem, codEd, numeroPiso);
            if(mapaOrError.isFailure){
                let erro = String(mapaOrError.errorValue());
                if(erro === "A passagem não existe." || erro === "O edifício não existe." || erro === "O piso não existe."){
                    res.status(404);
                }else{
                    res.status(400);
                }
                return res.json(mapaOrError.errorValue());
            }
            const mapaDTO = mapaOrError.getValue();
            res.status(200);
            return res.json(mapaDTO);
        }catch(e){
            return next(e);
        }
    }

    public async exportarMapaParaOPlaneamento(req: Request, res: Response, next: NextFunction) {
        try{
            let authOrError = this.authServiceInstance.checkAuth(req, res, ['gestor de campus', 'gestor de frota', 'gestor de tarefas', 'utente', 'admin']);
            if(authOrError.isFailure){
              return res.send();
            }
            let mapaOrError = await this.mapaServiceInstance.exportarMapaParaOPlaneamento();
            if(mapaOrError.isFailure){
                let erro = String(mapaOrError.errorValue());
                if(erro === "O Edifício que inseriu não existe." || erro === "O piso que inseriu não existe."){
                    res.status(404);
                }else{
                    res.status(400);
                }
                return res.json(mapaOrError.errorValue());
            }
            const mapaDTO = mapaOrError.getValue();
            res.status(200);
            return res.json(mapaDTO);
        }catch(e){
            return next(e);
        }
    }
}