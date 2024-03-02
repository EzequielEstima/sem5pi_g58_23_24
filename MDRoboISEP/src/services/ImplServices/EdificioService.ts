import { Service, Inject } from 'typedi';
import config from "../../../config";
import { Result } from "../../core/logic/Result";
import IEdificioRepo from '../IRepos/IEdificioRepo';
import IEdificioService from '../IServices/IEdificioService';
import IEdificioDTO from '../../dto/IEdificioDTO';
import { Edificio } from '../../domain/edificio/Edificio';
import { Nome } from '../../domain/edificio/Nome';
import { Codigo } from '../../domain/edificio/Codigo';
import { Dimensao } from '../../domain/edificio/Dimensao';
import { Piso } from '../../domain/piso/Piso';
import IListarEdMinEMaxPisosDTO from '../../dto/IListarEdMinEMaxPisosDTO';
import { EdificioMap } from '../../mappers/EdificioMap';
import { DescricaoEdificio } from '../../domain/edificio/DescricaoEdificio';
import IPisoRepo from '../IRepos/IPisoRepo';
import IElevadorRepo from '../IRepos/IElevadorRepo';
import ISalaRepo from '../IRepos/ISalaRepo';
import IPassagemRepo from '../IRepos/IPassagemRepo';
import IMapaRepo from '../IRepos/IMapaRepo';
import IPlaneamentoInfoDTO from '../../dto/IPlaneamentoInfoDTO';
import IPlaneamentoCaminhosDTO from '../../dto/IPlaneamentoCaminhosDTO';
import { verify } from 'crypto';
import { CoordenadasPassagem } from '../../domain/mapa/CoordenadasPassagem';
import ICoordenadasPontosDTO from '../../dto/ICoordenadasPontosDTO';

@Service()
export default class EdificioService implements IEdificioService {
  constructor(
    @Inject(config.repos.edificio.name) private edificioRepo: IEdificioRepo,
    @Inject(config.repos.piso.name) private pisoRepo: IPisoRepo,
    @Inject(config.repos.elevador.name) private elevadorRepo: IElevadorRepo,
    @Inject(config.repos.sala.name) private salaRepo: ISalaRepo,
    @Inject(config.repos.passagem.name) private passagemRepo: IPassagemRepo,
    @Inject(config.repos.mapa.name) private mapaRepo: IMapaRepo,
  ) { }
  public async getInformacaoPlaneamento(ICoordenadasPontosDTO: ICoordenadasPontosDTO): Promise<Result<IPlaneamentoCaminhosDTO>> {
    //Get Edificios
    let edificioList = await this.edificioRepo.getAllEdificios();
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
          let edificioA = await this.edificioRepo.findByPiso(pisoA.returnIdPiso());
          let edificioB = await this.edificioRepo.findByPiso(pisoB.returnIdPiso());

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
        x_origem: String(ICoordenadasPontosDTO.x_origem).toLowerCase(),
        y_origem: String(ICoordenadasPontosDTO.y_origem).toLowerCase(),
        piso_origem: ICoordenadasPontosDTO.piso_origem.toLowerCase(),
        x_destino: String(ICoordenadasPontosDTO.x_destino).toLowerCase(),
        y_destino: String(ICoordenadasPontosDTO.y_destino).toLowerCase(),
        piso_destino: ICoordenadasPontosDTO.piso_destino.toLowerCase(),
      } as IPlaneamentoInfoDTO;

      return this.comunicaoComPlaneamento(jsonDados);
  }

  private async comunicaoComPlaneamento(jsonDados: IPlaneamentoInfoDTO): Promise<Result<IPlaneamentoCaminhosDTO>> {
    try {
      // Dynamic import of 'fetch'
      const { default: fetch } = await import('node-fetch');
      const url = "http://10.9.11.58:8000/caminho/pontos_piso"
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

  public async criarEdificio(edificioDTO: IEdificioDTO): Promise<Result<IEdificioDTO>> {
    try {
      const edificioDocument = await this.edificioRepo.findByDomainId(edificioDTO.codigo);
      if (edificioDocument !== null) {
        return Result.fail<IEdificioDTO>("Edificio já existe")
      } else {
        let codigoOrError = Codigo.create(edificioDTO.codigo);
        let dimensaoOrError = Dimensao.create(edificioDTO.dimensaoX, edificioDTO.dimensaoY);
        if (codigoOrError.isFailure) {                                        //verificar se o codigo e a dimensão são válidos
          return Result.fail<IEdificioDTO>(codigoOrError.errorValue());
        } else if (dimensaoOrError.isFailure) {
          return Result.fail<IEdificioDTO>(dimensaoOrError.errorValue());
        }
        let listaPisos: Piso[] = [];
        let dadosEdificio: any = {
          dimensao: dimensaoOrError.getValue(),                         //adicionar os dados do edificio obrigatórios           
          listaPisos: listaPisos,
        }
        if (edificioDTO.nome) {                                         // verifcar se os dados opcionais existem e estão corretos
          let nomeOrError = Nome.create(edificioDTO.nome);            // e adiciona-os se estiverem
          if (nomeOrError.isSuccess) {
            dadosEdificio.nome = nomeOrError.getValue();
          } else {
            return Result.fail<IEdificioDTO>(nomeOrError.errorValue());
          }
        }
        if (edificioDTO.descricao) {
          let descricaoOrError = DescricaoEdificio.create(edificioDTO.descricao);
          if (descricaoOrError.isSuccess) {
            dadosEdificio.descricao = descricaoOrError.getValue();
          } else {
            return Result.fail<IEdificioDTO>(descricaoOrError.errorValue());
          }
        }
        const edificioOrError = Edificio.create(dadosEdificio, codigoOrError.getValue());  //criar o edificio

        if (edificioOrError.isFailure) {
          return Result.fail<IEdificioDTO>(edificioOrError.errorValue()); //verificar se o edificio foi criado com sucesso  
        }
        const edificio = edificioOrError.getValue();
        await this.edificioRepo.save(edificio);                            //dar save ao edificio
        return Result.ok<IEdificioDTO>(edificioDTO)
      }
    } catch (e) {
      throw e;
    }
  }
  public async listarEdificioMinEMaxPisos(listarEdificioMinEMaxPisosDTO: IListarEdMinEMaxPisosDTO): Promise<Result<IEdificioDTO[]>> {
    try {

      if (listarEdificioMinEMaxPisosDTO.minPisos > listarEdificioMinEMaxPisosDTO.maxPisos) {
        return Result.fail<IEdificioDTO[]>("O número mínimo de pisos não pode ser superior ao máximo");
      } else if (listarEdificioMinEMaxPisosDTO.minPisos < 0 || listarEdificioMinEMaxPisosDTO.maxPisos < 0) {
        return Result.fail<IEdificioDTO[]>("O número mínimo e máximo de pisos não pode ser inferior a 0");
      } else if (listarEdificioMinEMaxPisosDTO.minPisos === 0 && listarEdificioMinEMaxPisosDTO.maxPisos === 0) {
        return Result.fail<IEdificioDTO[]>("O número mínimo e máximo de pisos não pode ser 0");
      }


      const edificioDocument = await this.edificioRepo.getAllEdificios();
      let listaEdificiosDTO: IEdificioDTO[] = [];
      for (let edificio of edificioDocument) {
        if (edificio.verificaSeONumeroDePisosEstaDentroDosLimites(listarEdificioMinEMaxPisosDTO.minPisos, listarEdificioMinEMaxPisosDTO.maxPisos)) {
          listaEdificiosDTO.push(EdificioMap.toDTO(edificio));
        }
      }
      if (listaEdificiosDTO.length > 0) {
        return Result.ok<IEdificioDTO[]>(listaEdificiosDTO);
      }
    } catch (e) {
      throw e;
    }

    return Result.fail<IEdificioDTO[]>("Não existem edificios com o número de pisos pretendido");
  }

  public async listarEdificios(): Promise<Result<IEdificioDTO[]>> {
    try {
      const edificioDocument = await this.edificioRepo.getAllEdificios();
      let listaEdificiosDTO: IEdificioDTO[] = [];
      if (edificioDocument.length === 0) {
        return Result.fail<IEdificioDTO[]>("Não existem edificios");
      }
      for (let edificio of edificioDocument) {
        listaEdificiosDTO.push(EdificioMap.toDTO(edificio));
      }
      return Result.ok<IEdificioDTO[]>(listaEdificiosDTO);
    } catch (e) {
      throw e;
    }
  }

  public async editarEdificio(edificioDTO: IEdificioDTO): Promise<Result<IEdificioDTO>> {
    try {
      const edificio = await this.edificioRepo.findByDomainId(edificioDTO.codigo);
      if (edificio === null) {
        return Result.fail<IEdificioDTO>("Edificio não existe")
      }
      if (!!edificioDTO.descricao === false && !!edificioDTO.nome === false) {
        return Result.fail<IEdificioDTO>("É necessário pelo menos um dos campos para editar o edificio");
      }
      if (edificioDTO.descricao) {
        let descricaoOrError = DescricaoEdificio.create(edificioDTO.descricao);
        if (descricaoOrError.isFailure) {
          return Result.fail<IEdificioDTO>(descricaoOrError.errorValue());
        } else {
          edificio.alterarDescricao(descricaoOrError.getValue());
        }
      }
      if (edificioDTO.nome) {
        let nomeOrError = Nome.create(edificioDTO.nome);
        if (nomeOrError.isFailure) {
          return Result.fail<IEdificioDTO>(nomeOrError.errorValue());
        } else {
          edificio.alterarNome(nomeOrError.getValue());
        }
      }
      await this.edificioRepo.save(edificio);
      return Result.ok<IEdificioDTO>(edificioDTO);
    } catch (e) {
      throw e;
    }
  }

  public async deleteEdificio(codigo: string): Promise<Result<IEdificioDTO>> {

    const edificio = await this.edificioRepo.findByDomainId(codigo);
    if (edificio === null) {
      return Result.fail<IEdificioDTO>("Edificio não existe")
    }
    await this.edificioRepo.delete(edificio);
    let elevador = edificio.returnElevador();
    if (elevador) {
      await this.elevadorRepo.delete(elevador);
    }
    let listaPisos = edificio.returnListaPisos();
    for (let pisos of listaPisos) {
      let listaSalas = await this.salaRepo.findSalasByPiso(pisos.returnIdPiso());
      for (let sala of listaSalas) {
        await this.salaRepo.delete(await sala);
      }
      let listaPassagens = await this.passagemRepo.listarPassagensComUmPiso(pisos.returnIdPiso());
      for (let passagem of listaPassagens) {
        await this.passagemRepo.delete(await passagem);
      }
      if (pisos.props.mapa !== undefined && pisos.props.mapa !== null) {
        await this.mapaRepo.delete(pisos.props.mapa);
      }
      await this.pisoRepo.delete(pisos);
    }
    return Result.ok<IEdificioDTO>(EdificioMap.toDTO(edificio));
  }
}


