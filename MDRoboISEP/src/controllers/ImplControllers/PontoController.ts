import { Inject, Service } from "typedi";
import IPontoService from "../../services/IServices/IPontoService";
import config from "../../../config";
import { Request, Response, NextFunction } from "express";
import IPontoController from "../IControllers/IPontoController";
import ICarregarMapaDTO from "../../dto/ICarregarMapaDTO";
import { Result } from "../../core/logic/Result";

@Service()
export default class PontoController implements IPontoController {
    constructor(
        @Inject(config.services.ponto.name) private pontoServiceInstance : IPontoService
    ) {}

    public async carregarMapa(req: Request, res: Response, next: NextFunction) {
        try{
            const carregarMapaOrError = await this.pontoServiceInstance.carregarMapa(req.body as ICarregarMapaDTO);
            if (carregarMapaOrError.isFailure) {
                let erro = String(carregarMapaOrError.errorValue());
                if(erro === "Não existe nada para carregar no mapa." || erro === "Não existe elevador neste edifício." || 
                erro === "Não existem salas que satisfaçam os dados inseridos" || erro === "Não existem passagens que satisfaçam os dados inseridos"
                || erro === "O Edifício que inseriu não existe." || erro == "O piso que inseriu não existe."){
                    res.status(404);
                }else{
                    res.status(400);
                }
                return res.json(carregarMapaOrError.errorValue());
            }
            const carregarMapaDTO = carregarMapaOrError.getValue();
            res.status(201);
            return res.json( carregarMapaDTO );
        }catch(e){
            return next(e);
        }
    }
}