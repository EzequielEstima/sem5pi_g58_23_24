import { Container, Service, Inject } from 'typedi';
import config from '../../../config';

import { Result } from "../../core/logic/Result";
import IPisoService from '../IServices/IPisoService';
import IPisoDTO from '../../dto/IPisoDTO';
import { PisoMap } from '../../mappers/PisoMap';
import ISalaRepo from '../IRepos/ISalaRepo';
import IEdificioService from '../IServices/IEdificioService';
import IPlaneamentoService from '../IServices/IPlaneamentoService';
import ICoordenadasPontosDTO from '../../dto/ICoordenadasPontosDTO';
import IEdificioRepo from '../IRepos/IEdificioRepo';
import e from 'express';


@Service()
export default class PlaneamentoService implements IPlaneamentoService {
    constructor(
        @Inject(config.repos.sala.name) private salaRepoInstance : ISalaRepo,
        @Inject(config.services.edificio.name) private edificioServiceInstance : IEdificioService,
        @Inject(config.repos.edificio.name) private edificioRepoInstance : IEdificioRepo
    ) { }

    public async encontrarCaminhosEntreEdificios(salaInicial: string, salaFinal: string): Promise<Result<String>> {
        try {
            const salaI = await this.salaRepoInstance.findByDomainId(salaInicial);
            let flag = !!salaI;
            if (!flag) {
                return Result.fail<String>("A sala com o nome" + salaInicial + " não existe");
            }
            const salaF = await this.salaRepoInstance.findByDomainId(salaFinal);
            flag = !!salaF;
            if (!flag) {
                return Result.fail<String>("A sala com o nome" + salaFinal + " não existe");
            }
            let edificioI = await this.edificioRepoInstance.findByPiso(salaI.props.piso.returnIdPiso());
            flag = !!salaF;
            if (!flag) {
                return Result.fail<String>("O edificio com o piso" + salaI.props.piso.returnIdPiso() + " não existe");
            }
            let edificioF = await this.edificioRepoInstance.findByPiso(salaF.props.piso.returnIdPiso());
            flag = !!salaF;
            if (!flag) {
                return Result.fail<String>("O edificio com o piso" + salaF.props.piso.returnIdPiso() + " não existe");
            }
            
            if(!salaI.props.piso.hasMapa()){
                return Result.fail<String>("O piso da sala inicial não tem mapa");
            };
            if(!salaF.props.piso.hasMapa()){
                return Result.fail<String>("O piso da sala final não tem mapa");
            };
            let coordenadasSalaI;
            let coordenadasSalaF;
            let salasMapa = salaI.props.piso.props.mapa.props.coordenadasSala;
            for(let i = 0; i < salasMapa.length; i++){
                if(salasMapa[i].returnNome() == salaInicial){
                    coordenadasSalaI = salasMapa[i];
                }
            }
            salasMapa = salaF.props.piso.props.mapa.props.coordenadasSala;
            for(let i = 0; i < salasMapa.length; i++){
                if(salasMapa[i].returnNome() == salaFinal){
                    coordenadasSalaF = salasMapa[i];
                }
            }


            let ICoordenadasPontosDTO = {
                x_origem: coordenadasSalaI.returnOrdenadaPorta(),
                y_origem: coordenadasSalaI.returnAbcissaPorta(),
                piso_origem: edificioI.returnEdificioId() + salaI.props.piso.returnNumeroPiso(),
                x_destino: coordenadasSalaF.returnOrdenadaPorta(),
                y_destino: coordenadasSalaF.returnAbcissaPorta(),
                piso_destino: edificioF.returnEdificioId() + salaF.props.piso.returnNumeroPiso(),
            } as ICoordenadasPontosDTO;
            
            let answer = await this.edificioServiceInstance.getInformacaoPlaneamento(ICoordenadasPontosDTO);
            if(answer.isFailure){
                return Result.fail<String>("Não foi possível encontrar um caminho entre as salas");
            }
            return Result.ok<String>(answer.getValue().caminho);
        }
        catch (e) {
            throw e;
        }

    }

    public async encontrarCaminhoVigilancia(codEdificio: string, numeroPiso: string): Promise<Result<String>> {
        const edificio = await this.edificioRepoInstance.findByDomainId(codEdificio);

        if(!edificio){
            return Result.fail<String>("O edificio com o código " + codEdificio + " não existe");
        }

        const numeroPisoInt = parseInt(numeroPiso);

        var piso = edificio.returnPisoPeloNumero(numeroPisoInt);

        if (piso == null) {
            return Result.fail<String>("O piso com o número " + numeroPiso + " não existe");
        }
        if(!piso.hasMapa()){
            return Result.fail<String>("O piso não tem mapa");
        };

        let coordenadasVigilancia = piso.getCoordenadasVigilancia();
        if (coordenadasVigilancia == null) {
            return Result.fail<String>("Não é possível encontrar um caminho para a vigilância neste piso");
        }

        let ICoordenadasPontosDTO = {
            x_origem: coordenadasVigilancia[0],
            y_origem: coordenadasVigilancia[1],
            piso_origem: edificio.returnEdificioId() + numeroPisoInt,
            x_destino: coordenadasVigilancia[2],
            y_destino: coordenadasVigilancia[3],
            piso_destino: edificio.returnEdificioId() + numeroPisoInt,
        } as ICoordenadasPontosDTO;

        let answer = await this.edificioServiceInstance.getInformacaoPlaneamento(ICoordenadasPontosDTO);
        if(answer.isFailure){
            return Result.fail<String>("Não foi possível encontrar um caminho entre as salas");
        }
        return Result.ok<String>(answer.getValue().caminho);
    }    
}    