import { Container, Service, Inject } from 'typedi';
import config from '../../../config';

import IEdificioRepo from '../IRepos/IEdificioRepo';
import IPisoRepo from '../IRepos/IPisoRepo';
import IPontoRepo from '../IRepos/IPontoRepo';
import ICriarPisoDTO from '../../dto/ICriarPisoDTO';
import { Piso } from '../../domain/piso/Piso';
import { NumeroPiso } from '../../domain/piso/NumeroPiso';
import { DescricaoPiso } from '../../domain/piso/DescricaoPiso';
import { IdPiso } from '../../domain/piso/IdPiso';
import { Ponto } from '../../domain/ponto/Ponto';
import { Coordenadas } from '../../domain/ponto/Coordenadas';
import { TipoPonto } from '../../domain/ponto/TipoPonto';
import { IdPonto } from '../../domain/ponto/IdPonto';

import { Result } from "../../core/logic/Result";
import IPisoService from '../IServices/IPisoService';
import IPisoDTO from '../../dto/IPisoDTO';
import { PisoMap } from '../../mappers/PisoMap';
import IEditarPisoDTO from '../../dto/IEditarPisoDTO';
import IElevadorService from '../IServices/IElevadorService';
import { Edificio } from '../../domain/edificio/Edificio';
import { Elevador } from '../../domain/elevador/Elevador';
import IElevadorRepo from '../IRepos/IElevadorRepo';


@Service()
export default class PisoService implements IPisoService {
    constructor(
        @Inject(config.repos.piso.name) private pisoRepo: IPisoRepo,
        @Inject(config.repos.edificio.name) private edifRepo: IEdificioRepo,
        //@Inject(config.repos.elevador.name) private elevadorRepo: IElevadorRepo,
        // @Inject(config.repos.sala.name) private salaRepo : IElevadorService,
        //@Inject(config.services.elevador.name) private elevadorServiceInstance: IElevadorService
        // @Inject(config.services.sala.name) private salaServiceInstance : ISalaService

    ) { }
    public async listarPisosComMapa(codigo: string): Promise<Result<IPisoDTO[]>> {
        try {
            const edificio = await this.edifRepo.findByDomainId(codigo);
            let flag = !!edificio;
            if (!flag) {
                return Result.fail<IPisoDTO[]>("O edificio com o código " + codigo + " não existe");
            }
            let listaPisos = edificio.getAllPisosWithMapa();
            let listaPisosDTO: IPisoDTO[] = [];
            for (let elem of listaPisos) {
                listaPisosDTO.push(await PisoMap.toDTO(elem));
            }
            if (listaPisosDTO.length > 0) {
                return Result.ok<IPisoDTO[]>(listaPisosDTO);
            }
            return Result.fail<IPisoDTO[]>("Não existem pisos nesse Edificio");
        }
        catch (e) {
            throw e;
        }

    }
    /*
    public async carregarPiso(json: string): Promise<Result<IPisoDTO>> {
        const edificioOrError = await this.lerEdificioJson(json);
        if(edificioOrError.isFailure){
            return Result.fail<IPisoDTO>(edificioOrError.errorValue());
        }
        const pisoOrError = await this.obterPisoDeEdificio(edificioOrError.getValue(), json);    
        if(pisoOrError.isFailure){
            return Result.fail<IPisoDTO>(pisoOrError.errorValue());
        }
        const edificioComElevadorOrError = await this.carregarElevador(edificioOrError.getValue(), pisoOrError.getValue(), json);
        if(edificioComElevadorOrError.isFailure){
            return Result.fail<IPisoDTO>(edificioComElevadorOrError.errorValue());
        }
        const edificioComElevadorSalasOrError = await this.carregarSalas(edificioOrError.getValue(), pisoOrError.getValue(), json);
        if(edificioComElevadorSalasOrError.isFailure){
            return Result.fail<IPisoDTO>(edificioComElevadorSalasOrError.errorValue());
        }
        


    }
    */
    /*
        private async savePiso(edificio : Edificio, piso : Piso, elevador : Elevador ,listaSalas : Sala[]){
            return Result.fail<IPisoDTO>("Não implementado");
        }
    */
    /*
        private async carregarElevador(edificio : Edificio, piso : Piso, json : string) : Promise<Result<Edificio>>{
            let informacaoElevador : {
                xCoord : number,
                yCoord : number,
                orientacao: string,
                marca: string,
                modelo: string,
                numeroSerie: string,
                descricao: string,
            }
            informacaoElevador = JSON.parse(json);
    
            let elevadorDTO = {
                edificio : null,
                pisosServidos : null,
                xCoord : informacaoElevador.xCoord,
                yCoord : informacaoElevador.yCoord,
                orientacao: informacaoElevador.orientacao,
                marca: informacaoElevador.marca,
                modelo: informacaoElevador.modelo,
                numeroSerie: informacaoElevador.numeroSerie,
                descricao: informacaoElevador.descricao,
            }
            let edificioComElevadorOrError = await this.elevadorServiceInstance.carregarElevadorPiso(elevadorDTO, edificio, piso);
            if(edificioComElevadorOrError.isFailure){
                return Result.fail<Edificio>(edificioComElevadorOrError.errorValue());
            }
            return Result.ok<Edificio>(edificioComElevadorOrError.getValue());
        }
    
        private async carregarSalas(edificio : Edificio, piso : Piso, json : string) : Promise<Result<Edificio>>{
            return Result.fail<Edificio>("Não implementado");
        }
    
        private async lerEdificioJson(json:string): Promise<Result<Edificio>>{
            let informacaoEdificio :{
                codigoEdificio : string;
            }
            informacaoEdificio.codigoEdificio = JSON.parse(json);
            let edificioOrError = await this.edifRepo.findByDomainId(informacaoEdificio.codigoEdificio);
            if(edificioOrError === null){
                return Result.fail<Edificio>("O Edifício que inseriu não existe.")
            }
            return Result.ok<Edificio>(edificioOrError);
        }
    
        private async obterPisoDeEdificio(edificio : Edificio, json : string): Promise<Result<Piso>> {
            let pisoInserido : {
                numeroPiso : number;
            }
            pisoInserido.numeroPiso = JSON.parse(json);
            for(let piso of edificio.returnListaPisos()){
                if(piso.returnNumeroPiso() === pisoInserido.numeroPiso){
                    return Result.ok<Piso>(piso);
                }
            }
            return Result.fail<Piso>("O piso que inseriu não existe.")
        }
    
        */
    public async criarPiso(criarPisoDTO: ICriarPisoDTO): Promise<Result<ICriarPisoDTO>> {
        try {
            const edificio = await this.edifRepo.findByDomainId(criarPisoDTO.codigo);
            let flag = !!edificio;
            if (!flag) {
                return Result.fail<ICriarPisoDTO>("O edificio com o código " + criarPisoDTO.codigo + " não existe");
            }

            edificio.props.listaPisos;

            flag = edificio.verificaSePisoJaExiste(criarPisoDTO.numeroPiso)
            if (flag) {
                return Result.fail<ICriarPisoDTO>("O piso numero " + criarPisoDTO.numeroPiso + " já existe");
            }

            let maxId = await this.pisoRepo.getMaxId();
            maxId = maxId + 1;
            const numeroPisoOuErro = await NumeroPiso.create(criarPisoDTO.numeroPiso);
            const idPisoOuErro = await IdPiso.create(maxId);

            let descricaoOuErro;
            let finalResult;
            if (criarPisoDTO.descricaoPiso == null || criarPisoDTO.descricaoPiso == undefined || criarPisoDTO.descricaoPiso == "") {
                descricaoOuErro = null;
                finalResult = Result.combine([numeroPisoOuErro, idPisoOuErro]);
            } else {
                descricaoOuErro = await DescricaoPiso.create(criarPisoDTO.descricaoPiso);
                finalResult = Result.combine([numeroPisoOuErro, idPisoOuErro, descricaoOuErro]);
                if (descricaoOuErro.isSuccess == true) { descricaoOuErro = descricaoOuErro.getValue(); }
            }

            if (finalResult.isFailure) {
                return Result.fail<ICriarPisoDTO>(finalResult.error);
            }



            const pisoOuErro = await Piso.create({
                numeroPiso: numeroPisoOuErro.getValue(),
                descricaoPiso: descricaoOuErro,
                mapa: null,
            }, idPisoOuErro.getValue());

            if (pisoOuErro.isFailure) {
                return Result.fail<ICriarPisoDTO>(pisoOuErro.errorValue());
            }

            edificio.addPiso(pisoOuErro.getValue());



            await this.pisoRepo.save(pisoOuErro.getValue());

            await this.edifRepo.save(edificio);

            return Result.ok<ICriarPisoDTO>(criarPisoDTO);
        } catch (e) {
            throw e;
        }
    }

    public async listarTodosOsPisosDeUmEdificio(codigo: string): Promise<Result<IPisoDTO[]>> {
        const edificio = await this.edifRepo.findByDomainId(codigo);
        let flag = !!edificio;
        if (!flag) {
            return Result.fail<IPisoDTO[]>("O edificio com o código " + codigo + " não existe");
        }
        let listaPisos = edificio.props.listaPisos;
        let listaPisosDTO: IPisoDTO[] = [];
        for (let elem of listaPisos) {
            listaPisosDTO.push(await PisoMap.toDTO(elem));
        }
        if (listaPisosDTO.length > 0) {
            return Result.ok<IPisoDTO[]>(listaPisosDTO);
        }
        return Result.fail<IPisoDTO[]>("Não existem pisos nesse Edificio");
    }

    public async editarPiso(editarPisoDTO: IEditarPisoDTO): Promise<Result<IPisoDTO>> {
        const edificio = await this.edifRepo.findByDomainId(editarPisoDTO.codigoEdificio);
        let flag = !!edificio;
        if (!flag) {
            return Result.fail<IPisoDTO>("O edificio com o código " + editarPisoDTO.codigoEdificio + " não existe");
        }
        let piso = edificio.pisosCorrespondentes([editarPisoDTO.numeroPiso])[0];
        if (piso == null || piso == undefined) {
            return Result.fail<IPisoDTO>("O piso com o numero " + editarPisoDTO.numeroPiso + " não existe");
        }
        if (edificio.verificaSePisoJaExiste(editarPisoDTO.novoNumeroPiso)) {
            return Result.fail<IPisoDTO>("Já existe o piso numero " + editarPisoDTO.novoNumeroPiso);
        }
        let novoNumeroPisoOuErro;
        let descricaoPisoOuErro;
        if (editarPisoDTO.novoNumeroPiso != null && editarPisoDTO.novoNumeroPiso != undefined) {
            novoNumeroPisoOuErro = await NumeroPiso.create(editarPisoDTO.novoNumeroPiso);
            if (novoNumeroPisoOuErro.isFailure) {
                return Result.fail<IPisoDTO>(novoNumeroPisoOuErro.errorValue());
            }
        }
        if (editarPisoDTO.descricaoPiso != null && editarPisoDTO.descricaoPiso != undefined) {
            descricaoPisoOuErro = await DescricaoPiso.create(editarPisoDTO.descricaoPiso);
            if (descricaoPisoOuErro.isFailure) {
                return Result.fail<IPisoDTO>(descricaoPisoOuErro.errorValue());
            }
        }
        if (novoNumeroPisoOuErro != null && novoNumeroPisoOuErro != undefined) {
            let result = piso.atualizarNumeroPiso(novoNumeroPisoOuErro.getValue());
            if (result.isFailure) {
                return Result.fail<IPisoDTO>(result.errorValue());
            }
        }
        if (descricaoPisoOuErro != null && descricaoPisoOuErro != undefined) {
            let result = piso.atualizarDescricaoPiso(descricaoPisoOuErro.getValue());
            if (result.isFailure) {
                return Result.fail<IPisoDTO>(result.errorValue());
            }
        }
        await this.pisoRepo.save(piso);
        return Result.ok<IPisoDTO>(PisoMap.toDTO(piso));
    }

    public async listarPisosServidosPorElevador(codigoEd: string): Promise<Result<IPisoDTO[]>> {
        const edificio = await this.edifRepo.findByDomainId(codigoEd);
        let flag = !!edificio;
        if (!flag) {
            return Result.fail<IPisoDTO[]>("O edificio com o código " + codigoEd + " não existe");
        }
        let listaPisos = edificio.returnElevador().pisoServidosComMapa();

        let listaPisosDTO: IPisoDTO[] = [];
        for (let elem of listaPisos) {
            listaPisosDTO.push(await PisoMap.toDTO(elem));
        }
        if (listaPisosDTO.length > 0) {
            return Result.ok<IPisoDTO[]>(listaPisosDTO);
        }
        return Result.fail<IPisoDTO[]>("O elevador desse edificio não serve nenhum piso");
    }
}
