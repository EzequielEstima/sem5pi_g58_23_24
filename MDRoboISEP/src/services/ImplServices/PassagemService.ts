import { Service, Inject } from 'typedi';
import config from "../../../config";
import { Result } from "../../core/logic/Result";
import IPassagemRepo from '../IRepos/IPassagemRepo';
import IPassagemDTO from '../../dto/IPassagemDTO';
import IPassagemService from '../IServices/IPassagemService';
import IEdificioRepo from '../IRepos/IEdificioRepo';
import { Passagem } from '../../domain/passagem/Passagem';
import { IdPassagem } from '../../domain/passagem/IdPassagem';
import { Ponto } from '../../domain/ponto/Ponto';
import { Piso } from '../../domain/piso/Piso';
import IListarPassagemDTO from '../../dto/IListarPassagemDTO';
import { PassagemMap } from '../../mappers/PassagemMap';
import IListarPassagensPorParDeEdificioDTO from '../../dto/IListarPassagensPorParDeEdificioDTO';
import { Edificio } from '../../domain/edificio/Edificio';
import IListarPisoComPassagensDTO from '../../dto/IListarPisoComPassagensDTO';
@Service()

@Service()
export default class PassagemService implements IPassagemService {

    constructor(
        @Inject(config.repos.passagem.name) private passagemRepo: IPassagemRepo,
        @Inject(config.repos.edificio.name) private edificioRepo: IEdificioRepo,
    ) { }
    public async editarPassagens(passagemDTO: IPassagemDTO): Promise<Result<IPassagemDTO>> {
        try {
            const validacaoResultado = await this.validarDadosEditar(passagemDTO);
            if (validacaoResultado.isFailure) {
                return Result.fail<IPassagemDTO>(validacaoResultado.errorValue());
            }
            const {pisoA, pisoB, id }
                = validacaoResultado.getValue();

            const passagemOrError = await this.criarObjetoPassagem(pisoA, pisoB, id);
            if (passagemOrError.isFailure) {
                return Result.fail<IPassagemDTO>(passagemOrError.errorValue());
            }

            let okouErro = await this.salvarDados(passagemOrError.getValue());

            if (okouErro.isFailure) {
                return Result.fail<IPassagemDTO>(okouErro.errorValue());
            }

            return Result.ok<IPassagemDTO>(passagemDTO);
        }
        catch (e) {
            throw e;
        }
    }
    private async validarDadosEditar(passagemDTO: IPassagemDTO) : Promise<Result<any>> {
        
        let passagemDocument = await this.passagemRepo.findByDomainId(passagemDTO.id)

        if (passagemDocument == null) {
            return Result.fail<IPassagemDTO>("A passagem com o id " + passagemDTO.id + " não existe");
        }

        let edificioDocumentA = await this.edificioRepo.findByDomainId(passagemDTO.codigoEdificioA);

        if (edificioDocumentA == null) {
            return Result.fail<IPassagemDTO>("Edificio A não existe");
        }
        if (!edificioDocumentA.verificaSePisoJaExiste(passagemDTO.numeroPisoA)) {
            return Result.fail<IPassagemDTO>("Piso A não existe");
        }

        let edificioDocumentB = await this.edificioRepo.findByDomainId(passagemDTO.codigoEdificioB);

        if (edificioDocumentB == null) {
            return Result.fail<IPassagemDTO>("Edificio B não existe");
        }
        if (!edificioDocumentB.verificaSePisoJaExiste(passagemDTO.numeroPisoB)) {
            return Result.fail<IPassagemDTO>("Piso B não existe");
        }
        const pisoA = edificioDocumentA.returnPisoPeloNumero(passagemDTO.numeroPisoA);
        const pisoB = edificioDocumentB.returnPisoPeloNumero(passagemDTO.numeroPisoB);

        return Result.ok<any>({
            "pisoA": pisoA,
            "pisoB": pisoB,
            "id": passagemDTO.id,
        });
    }

    public async criarPassagem(passagemDTO: IPassagemDTO): Promise<Result<IPassagemDTO>> {
        try {
            const validacaoResultado = await this.validarDados(passagemDTO);

            if (validacaoResultado.isFailure) {
                return Result.fail<IPassagemDTO>(validacaoResultado.errorValue());
            }

            const {pisoA, pisoB, id }
                = validacaoResultado.getValue();


            const passagemOrError = await this.criarObjetoPassagem(pisoA, pisoB, id);
            if (passagemOrError.isFailure) {
                return Result.fail<IPassagemDTO>(passagemOrError.errorValue());
            }

            let okouErro = await this.salvarDados(passagemOrError.getValue());

            if (okouErro.isFailure) {
                return Result.fail<IPassagemDTO>(okouErro.errorValue());
            }

            return Result.ok<IPassagemDTO>(passagemDTO);
        } catch (e) {
            throw e;
        }
    }

    private async validarDados(passagemDTO: IPassagemDTO): Promise<Result<any>> {

        let passagemDocument = await this.passagemRepo.findByDomainId(passagemDTO.id)

        if (passagemDocument != null) {
            return Result.fail<IPassagemDTO>("A passagem com o id " + passagemDTO.id + " já existe");
        }

        let edificioDocumentA = await this.edificioRepo.findByDomainId(passagemDTO.codigoEdificioA);

        if (edificioDocumentA == null) {
            return Result.fail<IPassagemDTO>("Edificio A não existe");
        }
        if (!edificioDocumentA.verificaSePisoJaExiste(passagemDTO.numeroPisoA)) {
            return Result.fail<IPassagemDTO>("Piso A não existe");
        }

        let edificioDocumentB = await this.edificioRepo.findByDomainId(passagemDTO.codigoEdificioB);

        if (edificioDocumentB == null) {
            return Result.fail<IPassagemDTO>("Edificio B não existe");
        }
        if (!edificioDocumentB.verificaSePisoJaExiste(passagemDTO.numeroPisoB)) {
            return Result.fail<IPassagemDTO>("Piso B não existe");
        }
        const pisoA = edificioDocumentA.returnPisoPeloNumero(passagemDTO.numeroPisoA);
        const pisoB = edificioDocumentB.returnPisoPeloNumero(passagemDTO.numeroPisoB);


        return Result.ok<any>({
            "pisoA": pisoA,
            "pisoB": pisoB,
            "id": passagemDTO.id,
        });
    }

    private async criarObjetoPassagem(pisoA: Piso, pisoB: Piso, id: number): Promise<Result<Passagem>> {

        let idPassagemOuErro = await IdPassagem.create(id);

        const passagemOuErro = Passagem.create({
            pisoA: pisoA,
            pisoB: pisoB,
        }, idPassagemOuErro.getValue());

        return passagemOuErro;
    }

    private async salvarDados(passagem: Passagem): Promise<Result<void>> {

        let passagemOrError = await this.passagemRepo.save(passagem);
        if (passagemOrError == null) {
            return Result.fail<void>("Erro ao salvar passagem");
        }
        return Result.ok<void>();
    }


    public async listarPassagensPorParDeEdificios(edificiosDTO: IListarPassagensPorParDeEdificioDTO): Promise<Result<IListarPassagemDTO[]>> {
        try {
            var passagens: Passagem[] = [];

            if (edificiosDTO.edificioACod !== undefined && edificiosDTO.edificioBCod !== undefined) {

                let edificioAPisos = await this.edificioRepo.findByDomainId(edificiosDTO.edificioACod);

                if (edificioAPisos == null) {
                    return Result.fail<IListarPassagemDTO[]>("Edificio A não existe");
                }

                let edificioBPisos = await this.edificioRepo.findByDomainId(edificiosDTO.edificioBCod);

                if (edificioBPisos == null) {
                    return Result.fail<IListarPassagemDTO[]>("Edificio B não existe");
                }

                let pisosEdificioA = edificioAPisos.returnListaPisos();
                let pisosEdificioB = edificioBPisos.returnListaPisos();

                for (let pisoA of pisosEdificioA) {
                    for (let pisoB of pisosEdificioB) {
                        let passagensTemp = await this.passagemRepo.listarPassagensPorParDePisos(pisoB.returnIdPiso(), pisoA.returnIdPiso());
                        passagens = passagens.concat(passagensTemp);
                    }
                }
            } else if (edificiosDTO.edificioACod === undefined && edificiosDTO.edificioBCod === undefined) {
                passagens = await this.passagemRepo.findAll();
            } else {
                return Result.fail<IListarPassagemDTO[]>("Não é possível listar passagens apenas para um edificio");
            }

            if (passagens.length === 0) {
                return Result.fail<IListarPassagemDTO[]>("Não existem passagens que satisfaçam os parâmetros de pesquisa");
            }

            const passagensDTO: IListarPassagemDTO[] = [];

            for (let passagem of passagens) {
                passagensDTO.push(PassagemMap.toListarPassagemDTO(await passagem));
            }

            return Result.ok<IListarPassagemDTO[]>(passagensDTO);
        } catch (e) {
            throw e;
        }
    }


    public async listarPisosComPassagens(): Promise<Result<IListarPisoComPassagensDTO>> {
        try {

            type Pair<K, V> = {
                first: K;
                second: V;
            };

            let passagemList = await this.passagemRepo.findAll();

            if (passagemList == null) {
                return Promise.resolve(Result.fail<IListarPisoComPassagensDTO>("Não existem passagens"));
            }

            let idPisoList: number[] = [];
            let pisoList: Piso[] = [];
            let mapPassagemPairPiso: Map<Passagem, Pair<Piso, Piso>> = new Map();

            for (let passagem of passagemList) {
                mapPassagemPairPiso.set(passagem, { first: passagem.props.pisoA, second: passagem.props.pisoB });
            }

            for (let passagem of passagemList) {
                //Colocar só os pisos sem repetir
                idPisoList.push(Number(passagem.props.pisoA.id.toValue()));
                idPisoList.push(Number(passagem.props.pisoB.id.toValue()));
                pisoList.push(passagem.props.pisoA);
                pisoList.push(passagem.props.pisoB);
            }

            let edificioList: Edificio[] = [];

            for (let piso of idPisoList) {
                //procurar edificio no repo
                let edificio = await this.edificioRepo.findByPiso(piso);
                if (edificio != null) {
                    edificioList.push(edificio);
                }
                else {
                    return Promise.resolve(Result.fail<IListarPisoComPassagensDTO>
                        ("Não existe edificio para o piso com id: " + piso));
                }
            }
            let pairNumeroIdPisoPairDescricao: Pair<Pair<number, number>, string>[] = [];
        
            for (let piso of pisoList){

                let pair : Pair<Pair<number, number>, string>;
                if(
                    piso.props.descricaoPiso == null || piso.props.descricaoPiso.props.descricao == null|| 
                    piso.props.descricaoPiso.props.descricao == undefined || piso.props.descricaoPiso == undefined
                ){
                    pair = {
                        first: {first: piso.returnIdPiso(), second: piso.returnNumeroPiso()},
                        second: ""
                    };   
                }
                else{
                    pair = {
                    first: {first: piso.returnIdPiso(), second: piso.returnNumeroPiso()},
                    second: piso.props.descricaoPiso.props.descricao.toString()
                  };
                }
                pairNumeroIdPisoPairDescricao.push(pair);
            }

            if (edificioList.length != idPisoList.length) {
                return Promise.resolve(Result.fail<IListarPisoComPassagensDTO>("Não existe edificio para um dos pisos"));
            }
            let edificioPisoPair: Pair<number, Edificio>[] = [];
            for (let index = 0; index < edificioList.length; index++) {
                let pair: Pair<number, Edificio> = {
                    first: idPisoList[index],
                    second: edificioList[index]
                };
                edificioPisoPair.push(pair);
            }

            let passagensDTO: IListarPisoComPassagensDTO;
            passagensDTO = PassagemMap.toListarPisoComPassagensDTO(mapPassagemPairPiso,pairNumeroIdPisoPairDescricao,edificioPisoPair);

            return Promise.resolve(Result.ok<IListarPisoComPassagensDTO>(passagensDTO));
        } catch (e) {
            throw e;
        }
    }

}
