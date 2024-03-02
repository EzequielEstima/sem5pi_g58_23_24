import { Inject, Service } from "typedi";
import config from "../../../config";
import IMapaRepo from "../IRepos/IMapaRepo";
import IEdificioRepo from "../IRepos/IEdificioRepo";
import ICarregarMapaDTO from "../../dto/ICarregarMapaDTO";
import IExportarMapaDTO from "../../dto/IExportarMapaDTO";
import { Result } from "../../core/logic/Result";
import { Mapa } from "../../domain/mapa/Mapa";
import { TipoPonto } from "../../domain/mapa/TipoPonto";
import { Piso } from "../../domain/piso/Piso";
import ISalaRepo from "../IRepos/ISalaRepo";
import IPassagemRepo from "../IRepos/IPassagemRepo";
import { Edificio } from "../../domain/edificio/Edificio";
import { IdMapa } from "../../domain/mapa/IdMapa";
import IPisoRepo from "../IRepos/IPisoRepo";
import IMapaService from "../IServices/IMapaService";
import IPlaneamentoCaminhosDTO from "../../dto/IPlaneamentoCaminhosDTO";
import IPlaneamentoInfoDTO from "../../dto/IPlaneamentoInfoDTO";
import { CoordenadasPassagem } from "../../domain/mapa/CoordenadasPassagem";

@Service()
export default class MapaService implements IMapaService{
    constructor(
        @Inject(config.repos.mapa.name) private mapaRepo: IMapaRepo,
        @Inject(config.repos.edificio.name) private ediRepo: IEdificioRepo,
        @Inject(config.repos.sala.name) private salaRepo: ISalaRepo,
        @Inject(config.repos.passagem.name) private passagemRepo: IPassagemRepo,
        @Inject(config.repos.piso.name) private pisoRepo: IPisoRepo,
    ){}

    public async carregarMapa(mapaDTO : ICarregarMapaDTO) : Promise<Result<ICarregarMapaDTO>>{
        const edificioOrError = await this.verificarSeEdificioExiste(mapaDTO.codigoEdificio);
        if(edificioOrError.isFailure){
            return Result.fail<ICarregarMapaDTO>(edificioOrError.errorValue());
        }
        let edificio = edificioOrError.getValue();
        const pisoOrError = await this.verificarSePisoExiste(edificioOrError.getValue(), mapaDTO.numeroPiso);    
        if(pisoOrError.isFailure){
            return Result.fail<ICarregarMapaDTO>(pisoOrError.errorValue());
        }
        let piso = pisoOrError.getValue();
        
        let mapa = piso.props.mapa;
        if(mapa !== null && mapa !== undefined && mapa.verificarSeMapaVazio() === false){
            return Result.fail<ICarregarMapaDTO>("O mapa já tem algo carregado."); // Ainda não implementado.
        }
        let mapaTipoPonto : TipoPonto[][] = [];
        for(let i = 0; i <= edificio.returnDimensaoX(); i++){
            mapaTipoPonto[i] = [];
            for(let j = 0; j <= edificio.returnDimensaoY(); j++){
                mapaTipoPonto[i][j] = TipoPonto.create(" ").getValue();
            }
        }
        mapa = Mapa.create({mapa:mapaTipoPonto}, IdMapa.create(await this.mapaRepo.getMaxId() + 1).getValue()).getValue();
        mapa.carregarMapaComBermas();
    
        // Elevador

        let elevadorVaiSerCriado = true;
        if(mapaDTO.elevador === undefined){
            elevadorVaiSerCriado = false;
        }
        let salasVaoSerCriadas = true;
        if(mapaDTO.salas === undefined){
            salasVaoSerCriadas = false;
        }
        let passagensVaoSerCriadas = true;
        if(mapaDTO.passagens === undefined){
            passagensVaoSerCriadas = false;
        }

        if(!elevadorVaiSerCriado && !salasVaoSerCriadas && !passagensVaoSerCriadas){
            return Result.fail<ICarregarMapaDTO>("Não existe nada para carregar no mapa.");
        }

        // Salas
        if(salasVaoSerCriadas){
            if(await this.verificarSalasValidas(piso, mapaDTO) === false){
                return Result.fail<ICarregarMapaDTO>("Não existem salas que satisfaçam os dados inseridos");
            }
            for(let salaInfo of mapaDTO.salas){
                if(mapa.carregarSalaMapa(salaInfo.nome,salaInfo.abcissaA, salaInfo.ordenadaA, salaInfo.abcissaB,
                    salaInfo.ordenadaB, salaInfo.abcissaPorta, salaInfo.ordenadaPorta, salaInfo.orientacaoPorta) === false){
                    return Result.fail<ICarregarMapaDTO>("A sala está fora dos limites do edifício.");
                    }
            }

        }

        let elevador = edificio.returnElevador();
        if(elevadorVaiSerCriado){
            if(!edificio.temElevador()){
                return Result.fail<ICarregarMapaDTO>("Não existe elevador neste edifício.");
            }
            if(elevador.returnIdPisosServidos().includes(piso.returnIdPiso()) === false){
                return Result.fail<ICarregarMapaDTO>("O elevador não serve este piso.");
            };
            if(mapa.criarPontosElevador(mapaDTO.elevador.xCoord, mapaDTO.elevador.yCoord, mapaDTO.elevador.orientacao) === false){
                return Result.fail<ICarregarMapaDTO>("O elevador está fora dos limites do edifício.");
            }
        }

        // Passagens
        if(passagensVaoSerCriadas){
            if(await this.verificarPassagensValidas(piso, mapaDTO) === false){
                return Result.fail<ICarregarMapaDTO>("Não existem passagens que satisfaçam os dados inseridos");
            }
            
            for(let passagemInfo of mapaDTO.passagens){
                if(mapa.carregarPassagemMapa(passagemInfo) === false){
                    return Result.fail<ICarregarMapaDTO>("A passagem está fora dos limites do edifício.");
                }
            }
        }
        mapa.rodarMapa();
        piso.adicionarMapa(mapa);
        //save
        this.mapaRepo.save(mapa);
        this.pisoRepo.save(piso);
        
        return Result.ok<ICarregarMapaDTO>(mapaDTO);
    }





    private async verificarSalasValidas(piso : Piso, mapaDTO : ICarregarMapaDTO) : Promise<boolean>{
        let listaSala = await this.salaRepo.findSalasByPiso(piso.returnIdPiso());
        if(listaSala.length === 0){
            return false
        }
        for(let sala of mapaDTO.salas){
            let match = false;
            let i = 0;
            do{
                if(sala.nome === listaSala[i].returnNomeSala()){
                    match = true;
                }
                i++;
            }while(match === false && i < listaSala.length);
            if(match === false){
                return false
            }
        }
        return true;
    }


    private async verificarPassagensValidas(piso : Piso, mapaDTO : ICarregarMapaDTO) : Promise<boolean>{
        let listaPassagens = await this.passagemRepo.listarPassagensComUmPiso(piso.returnIdPiso());
        if(listaPassagens.length === 0){
            return false;
        }
        for(let passagem of mapaDTO.passagens){
            let match = false;
            let i = 0;
            do{
                if(passagem.id === listaPassagens[i].returnIdPassagem()){
                    match = true;
                }
                i++;
            }while(match === false && i < listaPassagens.length);
            if(match === false){
                return false;
            }
        }
        return true;
    }

    private async verificarSeEdificioExiste(codigoEdificio : string): Promise<Result<Edificio>>{
        let edificioOrError = await this.ediRepo.findByDomainId(codigoEdificio);
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

    public async exportarMapa(mapaDTO : IExportarMapaDTO) : Promise<Result<IExportarMapaDTO>>{
        let edificioOrError = await this.verificarSeEdificioExiste(mapaDTO.codigoEdificio);
        if(edificioOrError.isFailure){
            return Result.fail<IExportarMapaDTO>(edificioOrError.errorValue());
        }
        let edificio = edificioOrError.getValue();
        let pisoOrError = await this.verificarSePisoExiste(edificio, mapaDTO.numeroPiso);
        if(pisoOrError.isFailure){
            return Result.fail<IExportarMapaDTO>(pisoOrError.errorValue());
        }
        let piso = pisoOrError.getValue();

        let mapa = piso.props.mapa;

        if(mapa === null || mapa === undefined || mapa.verificarSeMapaVazio() === true){
            return Result.fail<IExportarMapaDTO>("O mapa não tem nada para exportar.");
        }

        let informcaoMapa = mapa.exportarMapa();
        let informacaoMapaDTO : IExportarMapaDTO = {
            texturaChao: "assets/ground.jpg",
            texturaParede: "assets/wall.jpg",
            modeloPorta: "assets/door.glb",
            modeloElevador: "assets/elevator.glb",
            codigoEdificio: mapaDTO.codigoEdificio,
            numeroPiso : mapaDTO.numeroPiso,
            matriz : informcaoMapa.matriz,
            elevador : informcaoMapa.elevador,
            passagens : informcaoMapa.passagens,
            salas : informcaoMapa.salas,
            posicaoInicialRobo : informcaoMapa.posicaoInicialRobo
        }
        return Result.ok<IExportarMapaDTO>(informacaoMapaDTO);
    }

    
    public async exportarMapaAtravesDeUmaPassagemEPiso(idPassagem: number, codEd: string, numeroPiso: number) : Promise<Result<IExportarMapaDTO>>{

        let passagemOrError = await this.passagemRepo.findByDomainId(idPassagem);
        if(passagemOrError === null){
            return Result.fail<IExportarMapaDTO>("A passagem não existe.");
        }
        let edificioOrError = await this.ediRepo.findByDomainId(codEd);
        if(edificioOrError === null){
            return Result.fail<IExportarMapaDTO>("O edifício não existe.");
        }
        let piso = edificioOrError.returnPisoPeloNumero(numeroPiso);
        if(piso === null){
            return Result.fail<IExportarMapaDTO>("O piso não existe.");
        }

        let pisoComMapa;

        if(passagemOrError.props.pisoA.returnIdPiso() === piso.returnIdPiso()){
            pisoComMapa = passagemOrError.props.pisoB;
        }else{
            pisoComMapa = passagemOrError.props.pisoA;
        }
        let mapa = pisoComMapa.props.mapa;
        if(mapa === null || mapa === undefined || mapa.verificarSeMapaVazio() === true){
            return Result.fail<IExportarMapaDTO>("O mapa não tem nada para exportar.");
        }

        let ediDestino = await this.ediRepo.findByPiso(pisoComMapa.returnIdPiso());
        if(ediDestino === null){
            return Result.fail<IExportarMapaDTO>("O edifício de destino não existe.");
        }

        let informacaoMapa = mapa.exportarMapa();
        let passagem = informacaoMapa.passagens.find(passagem => passagem.id === idPassagem);
        if(passagem === undefined){
            return Result.fail<IExportarMapaDTO>("A passagem não existe.");
        }
        let posicaoInicialRobo: {x: number, y: number};
        if(passagem.abcissaA === (informacaoMapa.matriz.length -1) && passagem.orientacao === "Norte"){
            posicaoInicialRobo = {x: passagem.abcissaA -1 , y: passagem.ordenadaA};
        }else if(passagem.ordenadaB === (informacaoMapa.matriz[0].length -1) && passagem.orientacao === "Oeste"){
            posicaoInicialRobo = {x: passagem.abcissaA, y: passagem.ordenadaB - 1};
        }else{
            posicaoInicialRobo = {x: passagem.abcissaA, y: passagem.ordenadaB};
        }

        let informacaoMapaDTO : IExportarMapaDTO = {
            texturaChao: "assets/ground.jpg",
            texturaParede: "assets/wall.jpg",
            modeloPorta: "assets/door.glb",
            modeloElevador: "assets/elevator.glb",
            codigoEdificio: ediDestino.returnEdificioId(),
            numeroPiso : pisoComMapa.returnNumeroPiso(),
            matriz : informacaoMapa.matriz,
            elevador : informacaoMapa.elevador,
            passagens : informacaoMapa.passagens,
            salas : informacaoMapa.salas,
            posicaoInicialRobo : posicaoInicialRobo
        }

        return Result.ok<IExportarMapaDTO>(informacaoMapaDTO);
    }

    public async exportarMapaParaOPlaneamento() : Promise<Result<IPlaneamentoCaminhosDTO>>{
        //Get Edificios
    let edificioList = await this.ediRepo.getAllEdificios();
    if (edificioList.length == null || edificioList.length == undefined) {
      return Result.fail<IPlaneamentoCaminhosDTO>("Não existem edificios");
    }
    if (edificioList.length === 0) {
      return Result.fail<IPlaneamentoCaminhosDTO>("Não existem edificios");
    }
    let pisoStringList: string[] = [];
    let elevadorStringList: string[] = [];
    let CoordElevadorStringList: string[] = [];
    let corredorStringList: string[] = [];
    let coordCorredorStringList: string[] = [];
    let salaStringList: string[] = [];
    let CoordPortasStringList: string[] = [];
    let mapaStringList: string[] = [];
    let dimStringList: string[] = [];
    // Desglosar informação
    for (let edificio of edificioList) {

      let pisos = edificio.getAllPisosWithMapa();
      let elevador = edificio.returnElevador();
      let pisosServidos: Piso[] = [];
      if (elevador !== null && elevador !== undefined) {
        pisosServidos = elevador.pisoServidosComMapa();
      }
      // Pisos
      if (pisos != null && pisos != undefined && pisos.length > 0) {

        let pisoString = "pisos(" + edificio.returnEdificioId().toLowerCase() + ",[";
        let i = 0;
        for (let piso of pisos) {
          if (i == 0) {
            pisoString += edificio.returnEdificioId().toLowerCase() + "" + String(piso.returnNumeroPiso()).toLowerCase();
            i++;
          }
          else {
            pisoString += "," + edificio.returnEdificioId().toLowerCase() + "" + String(piso.returnNumeroPiso()).toLowerCase();
          }
          // Salas
          let mapa = piso.returnMapa();
          if (mapa == null || mapa == undefined) {
            return Result.fail<IPlaneamentoCaminhosDTO>("Não existe mapa");
          }
          if (mapa.verificaSeExisteSalas()) {
            let salasByPisos = mapa.returnSalasNoMapa();
            let j = 0;
            let salaString = "salas(" + edificio.returnEdificioId().toLowerCase() + "" + String(piso.returnNumeroPiso()).toLowerCase() + ",[";
            for (let sala of salasByPisos) {
              let coordPortasString: string;
              if (j == 0) {
                salaString += sala.returnNome().toLowerCase().replace(/\s+/g, '').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                j++;
              }
              else {
                salaString += "," + sala.returnNome().toLowerCase().replace(/\s+/g, '').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
              }
              // CoordPortas
              coordPortasString = "coordPorta(" + sala.returnNome().toLowerCase().replace(/\s+/g, '').normalize("NFD").replace(/[\u0300-\u036f]/g, "") + ","
                + String(sala.returnAbcissaPorta()).toLowerCase() + ","
                + String(sala.returnOrdenadaPorta()).toLowerCase() + ").";
              if (CoordPortasStringList.includes(coordPortasString) == false) {
              CoordPortasStringList.push(coordPortasString);
              }
            }
            salaString += "]).";
            if (salaStringList.includes(salaString) == false) {
              salaStringList.push(salaString);
            }
          }
          // criar matriz do mapa
          let matriz = mapa.returnMatrizParaPlaneamento();
          let stringElemento: string;
          for (let i = 0; i < matriz.length; i++) {
            for (let j = 0; j < matriz[i].length; j++) {
              stringElemento = "m(" + edificio.returnEdificioId().toLowerCase() + String(piso.returnNumeroPiso()).toLowerCase()
                + "," + String(j).toLowerCase() + "," + String(i).toLowerCase() + "," + matriz[i][j].toLowerCase() + ").";
              mapaStringList.push(stringElemento);
            }
          }

        }
        pisoString += "]).";
        pisoStringList.push(pisoString);
      }
      // Elevador
      if (pisosServidos != null && pisosServidos != undefined && pisosServidos.length > 0
        && elevador !== null && elevador !== undefined) {
        let elevadorString = "elevador(" + edificio.returnEdificioId().toLowerCase() + ",[";
        let coordElevadorString: string;
        let i = 0;
        for (let piso of pisosServidos) {
          if (i == 0) {
            elevadorString += edificio.returnEdificioId().toLowerCase() + String(piso.returnNumeroPiso()).toLowerCase();
            i++;
          }
          else {
            elevadorString += "," + edificio.returnEdificioId().toLowerCase() + String(piso.returnNumeroPiso()).toLowerCase();
          }
          // CoordElevador
          let mapa = piso.returnMapa();
          if (mapa !== null && mapa !== undefined) {
            coordElevadorString = "coordElevador(" + edificio.returnEdificioId().toLowerCase() + "," +
              String(mapa.returnXCoordElevador()).toLowerCase() + "," + String(mapa.returnYCoordElevador()).toLowerCase() + ").";
            if (CoordElevadorStringList.includes(coordElevadorString) == false) {
              CoordElevadorStringList.push(coordElevadorString);
            }
          }
        }
        elevadorString += "]).";
          elevadorStringList.push(elevadorString);

        let stringDim = "dim_ed(" + edificio.returnEdificioId().toLowerCase() + "," + String(edificio.returnDimensaoX()+1).toLowerCase() + "," + String(edificio.returnDimensaoY()+1).toLowerCase() + ").";
        dimStringList.push(stringDim);

      }
    }
      // Corredor
      let corredorString: string;
      let passagemLista = await this.passagemRepo.findAll();

      if (passagemLista == null || passagemLista == undefined) {
        return Result.fail<IPlaneamentoCaminhosDTO>("Não existem passagens");
      }
      if (passagemLista.length === 0) {
        return Result.fail<IPlaneamentoCaminhosDTO>("Não existem passagens");
      }

      for (let passagem of passagemLista) {
        let pisoA = passagem.props.pisoA;
        let pisoB = passagem.props.pisoB;
        if (pisoA !== null && pisoA !== undefined && pisoA.hasMapa()
          && pisoB !== null && pisoB !== undefined && pisoB.hasMapa()) {
          let edificioA = await this.ediRepo.findByPiso(pisoA.returnIdPiso());
          let edificioB = await this.ediRepo.findByPiso(pisoB.returnIdPiso());

          if (edificioA == null || edificioA == undefined) {
            return Result.fail<IPlaneamentoCaminhosDTO>("Não existem edificios");
          }
          if (edificioB == null || edificioB == undefined) {
            return Result.fail<IPlaneamentoCaminhosDTO>("Não existem edificios");
          }
          corredorString = "corredor(" + String(edificioA.returnEdificioId()).toLowerCase() + "," + String(edificioB.returnEdificioId()).toLowerCase() + ","
            + String(edificioA.returnEdificioId()).toLowerCase() + String(pisoA.returnNumeroPiso()).toLowerCase() + "," + String(edificioB.returnEdificioId()).toLowerCase()
            + String(pisoB.returnNumeroPiso()).toLowerCase() + ").";
          corredorStringList.push(corredorString);

          let mapaA = pisoA.returnMapa();
          let listaCoordCorredorA = mapaA.returnCoordenadasPassagem();
          let mapaB = pisoB.returnMapa();
          let listaCoordCorredorB = mapaB.returnCoordenadasPassagem();
          let corredorA: CoordenadasPassagem;
          let corredorB: CoordenadasPassagem;
          for (let cordA of listaCoordCorredorA) {
            if (cordA.isPassagem(passagem.returnIdPassagem())) {
              corredorA = cordA;
              break;
            }
          }
          for (let cordB of listaCoordCorredorB) {
            if (cordB.isPassagem(passagem.returnIdPassagem())) {
              corredorB = cordB;
              break;
            }
          }
          if (corredorA !== null && corredorA !== undefined && corredorB !== null && corredorB !== undefined) {
            let coordCorredorString = "coordCorredor(" + edificioA.returnEdificioId().toLowerCase() + String(pisoA.returnNumeroPiso()) +
              "," + edificioB.returnEdificioId().toLowerCase() + String(pisoB.returnNumeroPiso()) + "," +
              String(corredorA.returnAbcissaInf()).toLowerCase() + "," + String(corredorA.returnOrdenadaInf()).toLowerCase() + "," +
              String(corredorA.returnAbcissaSup()).toLowerCase() + "," + String(corredorA.returnOrdenadaSup()).toLowerCase() + "," +
              String(corredorB.returnAbcissaInf()).toLowerCase() + "," + String(corredorB.returnOrdenadaInf()).toLowerCase() + "," +
              String(corredorB.returnAbcissaSup()).toLowerCase() + "," + String(corredorB.returnOrdenadaSup()).toLowerCase() + ").";
            coordCorredorStringList.push(coordCorredorString);
          }
        }
      }

      if (pisoStringList.length === 0 || elevadorStringList.length === 0 || CoordElevadorStringList.length === 0
        || corredorStringList.length === 0 || coordCorredorStringList.length === 0 || salaStringList.length === 0
        || CoordPortasStringList.length === 0 || mapaStringList.length === 0 || dimStringList.length === 0) {
        return Result.fail<IPlaneamentoCaminhosDTO>("Não existem dados para o planeamento");
      }
      const jsonDados = {
        pisos: pisoStringList,
        elevadores: elevadorStringList,
        coordElevadores: CoordElevadorStringList,
        corredores: corredorStringList,
        coordCorredores: coordCorredorStringList,
        salas: salaStringList,
        coordPortas: CoordPortasStringList,
        listaMatrizMapa: mapaStringList,
        dimensoes: dimStringList,
      } as IPlaneamentoInfoDTO;

      return this.comunicaoComPlaneamento(jsonDados);
    }

    private async comunicaoComPlaneamento(jsonDados: IPlaneamentoInfoDTO): Promise<Result<IPlaneamentoCaminhosDTO>> {
        try {
          // Dynamic import of 'fetch'
          const { default: fetch } = await import('node-fetch');
          const url = "http://10.9.11.58:8000/carregarMapa"
          // Faça a requisição HTTP POST
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonDados) // Converte o objeto JavaScript para JSON
          });
    
          // Converte a resposta para JSON
          const responseData = await response.json() as IPlaneamentoCaminhosDTO;
          return Result.ok<IPlaneamentoCaminhosDTO>(responseData);
        } catch (error) {
          return Result.fail<IPlaneamentoCaminhosDTO>(error);
        }
      }

}