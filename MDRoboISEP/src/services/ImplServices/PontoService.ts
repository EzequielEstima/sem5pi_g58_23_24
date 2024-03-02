import { Inject, Service } from "typedi";
import IPontoService from "../IServices/IPontoService";
import config from "../../../config";
import IPontoRepo from "../IRepos/IPontoRepo";
import ICarregarMapaDTO from "../../dto/ICarregarMapaDTO";
import { Result } from "../../core/logic/Result";
import { Edificio } from "../../domain/edificio/Edificio";
import { Piso } from "../../domain/piso/Piso";
import IEdificioRepo from "../IRepos/IEdificioRepo";
import ISalaRepo from "../IRepos/ISalaRepo";
import IPassagemRepo from "../IRepos/IPassagemRepo";
import { Ponto } from "../../domain/ponto/Ponto";
import { Passagem } from "../../domain/passagem/Passagem";
import { Sala } from "../../domain/sala/Sala";
import IElevadorRepo from "../IRepos/IElevadorRepo";
import { Elevador } from "../../domain/elevador/Elevador";

/*
@Service()
export default class PontoService implements IPontoService{
    constructor(
        @Inject(config.repos.ponto.name) private pontoRepo: IPontoRepo,
        @Inject(config.repos.edificio.name) private edifRepo: IEdificioRepo,
        @Inject(config.repos.elevador.name) private elevadorRepo: IElevadorRepo,
        @Inject(config.repos.sala.name) private salaRepo: ISalaRepo,
        @Inject(config.repos.passagem.name) private passagemRepo: IPassagemRepo,
        
    ) {}
    /*
    public async carregarMapa(informacaoPiso : ICarregarMapaDTO) : Promise<Result<ICarregarMapaDTO>>{


        const edificioOrError = await this.verificarSeEdificioExiste(informacaoPiso.codigoEdificio);
        if(edificioOrError.isFailure){
            return Result.fail<ICarregarMapaDTO>(edificioOrError.errorValue());
        }
        const pisoOrError = await this.verificarSePisoExiste(edificioOrError.getValue(), informacaoPiso.numeroPiso);    
        if(pisoOrError.isFailure){
            return Result.fail<ICarregarMapaDTO>(pisoOrError.errorValue());
        }

        if(!pisoOrError.getValue().verificarSeMapaVazio()){
            return Result.fail<ICarregarMapaDTO>("O mapa já tem algo carregado.");
        }
        pisoOrError.getValue().criacaoBermasPiso();
    
        // Elevador

        let elevadorVaiSerCriado = true;
        if(informacaoPiso.elevador === undefined){
            elevadorVaiSerCriado = false;
        }
        let salasVaoSerCriadas = true;
        if(informacaoPiso.salas === undefined){
            salasVaoSerCriadas = false;
        }
        let passagensVaoSerCriadas = true;
        if(informacaoPiso.passagens === undefined){
            passagensVaoSerCriadas = false;
        }

        if(!elevadorVaiSerCriado && !salasVaoSerCriadas && !passagensVaoSerCriadas){
            return Result.fail<ICarregarMapaDTO>("Não existe nada para carregar no mapa.");
        }

        let elevador : Elevador;
        if(elevadorVaiSerCriado){

            if(!edificioOrError.getValue().temElevador()){
                return Result.fail<ICarregarMapaDTO>("Não existe elevador neste edifício.");
            }
            if(!edificioOrError.getValue().props.elevador.returnIdPisosServidos().includes(pisoOrError.getValue().returnIdPiso())){
                return Result.fail<ICarregarMapaDTO>("O elevador não serve este piso.");
            };

            const listaPontosElevador = this.criarListaPontosElevador(informacaoPiso, pisoOrError.getValue());
            elevador = edificioOrError.getValue().returnElevador();
            let listaPontosElevadorFinal = elevador.pontosAtuais().concat(listaPontosElevador);
            elevador.updatePontos(listaPontosElevadorFinal);
        }
        let listaSalas;
        // Salas
        if(salasVaoSerCriadas){
            listaSalas = await this.retornarSalasValidas(pisoOrError.getValue(), informacaoPiso);
            if(listaSalas.isFailure){
                return Result.fail<ICarregarMapaDTO>(listaSalas.errorValue());
            }
            for(let sala of listaSalas.getValue()){
                let listaPontosDiagonal = this.criarPontosDiagonalSala(informacaoPiso, sala, pisoOrError.getValue());
                sala.atualizarListaPontos(listaPontosDiagonal);
                let listaPontosSala = this.criarListaPontosSala(informacaoPiso, sala,pisoOrError.getValue());
            }
        }

        let listaPassagens;
        // Passagens
        if(passagensVaoSerCriadas){
            listaPassagens = await this.retornarPassagensValidadas(pisoOrError.getValue(), informacaoPiso);
            if(listaPassagens.isFailure){
                return Result.fail<ICarregarMapaDTO>(listaPassagens.errorValue());
            }
            
            for(let passagem of listaPassagens.getValue()){
                let listaPontos = this.criarListaPontosPassagem(informacaoPiso, passagem, pisoOrError.getValue());
                passagem.atualizarListaPontos(listaPontos);
            }
        }


        //save
        for(let i = 0; i < pisoOrError.getValue().props.mapa.length; i++){
            for(let j = 0; j < pisoOrError.getValue().props.mapa[i].length; j++){
                await this.pontoRepo.save(pisoOrError.getValue().props.mapa[i][j]);
            }
        }
        if(elevadorVaiSerCriado){
            this.elevadorRepo.save(elevador);
        }
        if(salasVaoSerCriadas){
            for(let sala of listaSalas.getValue()){
                await this.salaRepo.save(sala);
            }
        }
        if(passagensVaoSerCriadas){
            for(let passagem of listaPassagens.getValue()){
                await this.passagemRepo.save(passagem);
            }
        }
        return Result.ok<ICarregarMapaDTO>(informacaoPiso);
    }
    private async retornarSalasValidas(piso : Piso, informacaoPiso : ICarregarMapaDTO) : Promise<Result<Sala[]>>{
        let listaSala = await this.salaRepo.findSalasByPiso(piso.returnIdPiso());
        if(listaSala.length === 0){
            return Result.fail<Sala[]>("Não existem salas que satisfaçam os dados inseridos");
        }
        let listaSalasValidas : Sala[] = [];
        for(let sala of informacaoPiso.salas){
            let match = false;
            let i = 0;
            do{
                if(sala.nome === listaSala[i].returnNomeSala()){
                    listaSalasValidas.push(listaSala[i]);
                    match = true;
                }
                i++;
            }while(match === false && i < listaSala.length);
            if(match === false){
                return Result.fail<Sala[]>("Não existem salas que satisfaçam os dados inseridos");
            }
        }
        return Result.ok<Sala[]>(listaSala);
    }


    private async retornarPassagensValidadas(piso : Piso, informacaoPiso : ICarregarMapaDTO) : Promise<Result<Passagem[]>>{
        let listaPassagens = await this.passagemRepo.listarPassagensComUmPiso(piso.returnIdPiso());
        let listaPassagensValidas : Passagem[] = [];
        if(listaPassagens.length === 0){
            return Result.fail<Passagem[]>("Não existem passagens que satisfaçam os dados inseridos");
        }
        for(let passagem of informacaoPiso.passagens){
            let match = false;
            let i = 0;
            do{
                if(passagem.id === listaPassagens[i].returnIdPassagem()){
                    listaPassagensValidas.push(listaPassagens[i]);
                    match = true;
                }
                i++;
            }while(match === false && i < listaPassagens.length);
            if(match === false){
                return Result.fail<Passagem[]>("Não existem passagens que satisfaçam os dados inseridos");
            }
        }
        return Result.ok<Passagem[]>(listaPassagensValidas);
    }

    private async verificarSeEdificioExiste(codigoEdificio : string): Promise<Result<Edificio>>{
        let edificioOrError = await this.edifRepo.findByDomainId(codigoEdificio);
        if(edificioOrError === null){
            return Result.fail<Edificio>("O Edifício que inseriu não existe.")
        }
        return Result.ok<Edificio>(edificioOrError);
    }

    private async verificarSePisoExiste(edificio : Edificio, numeroPiso : number): Promise<Result<Piso>> {
        for(let piso of edificio.returnListaPisos()){
            if(piso.returnNumeroPiso() === numeroPiso){
                return Result.ok<Piso>(piso);
            }
        }
        return Result.fail<Piso>("O piso que inseriu não existe.")
    }

    private criarListaPontosElevador(informacaoPiso : ICarregarMapaDTO, piso : Piso) : Ponto[]{
        let listaPontos : Ponto[] = [];
                    
        let xCoordSup = informacaoPiso.elevador.xCoord;
        let yCoordSup = informacaoPiso.elevador.yCoord;
        let xCoordInf : number;
        let yCoordInf : number;
        if (informacaoPiso.elevador.orientacao === 'Norte') {
            xCoordInf = xCoordSup;
            yCoordInf = yCoordSup + 1;
        } else if (informacaoPiso.elevador.orientacao === 'Oeste') {
            xCoordInf = xCoordSup + 1;
            yCoordInf = yCoordSup;
        }

        listaPontos = piso.returnPontosParaElevador(xCoordSup,yCoordSup,informacaoPiso.elevador.orientacao);

        for(let ponto of listaPontos){
            ponto.toElevador();
        }
        return listaPontos;
    }

    private criarListaPontosPassagem(informacaoPiso : ICarregarMapaDTO, passagem : Passagem, piso : Piso) : Ponto[]{
        let listaPontos : Ponto[] = [];
        let passagemInfo;

        for(let passagemPiso of informacaoPiso.passagens){
            if(passagem.returnIdPassagem() === passagemPiso.id){
                passagemInfo = passagemPiso;
                break;
            }
        }

        listaPontos = piso.returnPontosParaPassagem(passagemInfo.abcissa,passagemInfo.ordenada,passagemInfo.orientacao);
        return listaPontos;
    }

    private criarPontosDiagonalSala(informacaoPiso : ICarregarMapaDTO, sala : Sala, piso : Piso) : Ponto[]{
        let listaPontos : Ponto[] = [];
        let salaInfo;

        for(let salaPiso of informacaoPiso.salas){
            if(sala.returnNomeSala() === salaPiso.nome){
                salaInfo = salaPiso;
                break;
            }
        }
        listaPontos = piso.returnPontosParaDiagonalSala(salaInfo.abcissaA, salaInfo.ordenadaA, salaInfo.abcissaB, salaInfo.ordenadaB);

        listaPontos[0].toParedeNorteOeste();
        listaPontos[1].toVazio();
        return listaPontos;
    }

    private criarListaPontosSala(informacaoPiso : ICarregarMapaDTO, sala : Sala, piso : Piso) : Ponto[]{
        let listaPontos : Ponto[] = [];
        let salaInfo;

        for(let salaPiso of informacaoPiso.salas){
            if(sala.returnNomeSala() === salaPiso.nome){
                salaInfo = salaPiso;
                break;
            }
        }
        listaPontos = piso.returnPontosParaParedesSalas(salaInfo.abcissaA, salaInfo.ordenadaA, salaInfo.abcissaB,
             salaInfo.ordenadaB, salaInfo.abcissaPorta, salaInfo.ordenadaPorta);

        return listaPontos;
    }
}*/