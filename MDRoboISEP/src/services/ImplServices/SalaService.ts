import { Service, Inject } from 'typedi';
import config from "../../../config";
import { Result } from "../../core/logic/Result";
import ISalaDTO from '../../dto/ISalaDTO';
import ISalaService from '../IServices/ISalaService';
import IEdificioRepo from '../IRepos/IEdificioRepo';
import ISalaRepo from '../IRepos/ISalaRepo';
import NomeSala from '../../domain/sala/NomeSala';
import { Sala } from '../../domain/sala/Sala';
import CategorizacaoSala from '../../domain/sala/CategorizacaoSala';
import DescricaoSala from '../../domain/sala/DescricaoSala';
import { Piso } from '../../domain/piso/Piso';

@Service()

@Service()
export default class SalaService implements ISalaService {

    constructor(
        @Inject(config.repos.edificio.name) private edificioRepo: IEdificioRepo,
        @Inject(config.repos.sala.name) private salaRepo: ISalaRepo,
    ) { }

    public async criarSala(salaDTO: ISalaDTO): Promise<Result<ISalaDTO>> {
        try {
            const validacaoResultado = await this.validarDados(salaDTO);

            if (validacaoResultado.isFailure) {
                return Result.fail<ISalaDTO>(validacaoResultado.errorValue());
            }

            let {piso }
                = validacaoResultado.getValue();

            const salaOrError = await this.criarObjetoSala(salaDTO.categoria, salaDTO.descricao, piso, salaDTO.id);
            if (salaOrError.isFailure) {
                return Result.fail<ISalaDTO>(salaOrError.errorValue());
            }

            let okouErro = await this.salvarDados(salaOrError.getValue());

            if (okouErro.isFailure) {
                return Result.fail<ISalaDTO>(okouErro.errorValue());
            }

            return Result.ok<ISalaDTO>(salaDTO);
        } catch (e) {
            throw e;
        }
    }
    async salvarDados(sala: Sala): Promise<Result<void>> {
        let salaOrError = await this.salaRepo.save(sala);
        if (salaOrError == null) {
            return Result.fail<void>("Erro ao salvar passagem");
        }
        return Result.ok<void>();
    }
    async criarObjetoSala(categoria: string, descricao: string, piso: Piso, nome: string): Promise<Result<any>> {

        let idSalaOuErro = NomeSala.create(nome);
        if (idSalaOuErro.isFailure) {
            return Result.fail<ISalaDTO>(idSalaOuErro.errorValue());
        }

        let categoriaOuErro = CategorizacaoSala.create(categoria);
        if (categoriaOuErro.isFailure) {
            return Result.fail<ISalaDTO>(categoriaOuErro.errorValue());
        }

        let descricaoOuErro = DescricaoSala.create(descricao);
        if (descricaoOuErro.isFailure) {
            return Result.fail<ISalaDTO>(descricaoOuErro.errorValue());
        }

        const salaOuErro = Sala.create({
            categoria: categoriaOuErro.getValue(),
            descricao: descricaoOuErro.getValue(),
            piso: piso,
        }, idSalaOuErro.getValue());

        return salaOuErro;
    }

    async validarDados(salaDTO: ISalaDTO): Promise<Result<any>> {
        let salaDocument = await this.salaRepo.findByDomainId(salaDTO.id)
        if (salaDocument != null) {
            return Result.fail<ISalaDTO>("Sala já existe");
        }
        let edificioDocument = await this.edificioRepo.findByDomainId(salaDTO.codigoEdificio);
        if (edificioDocument == null) {
            return Result.fail<ISalaDTO>("Edificio não existe");
        }
        if (!edificioDocument.verificaSePisoJaExiste(salaDTO.numeroPiso)) {
            return Result.fail<ISalaDTO>("Piso não existe");
        }
       
        const piso = edificioDocument.returnPisoPeloNumero(salaDTO.numeroPiso);

        return Result.ok<any>({
            "edificioDocument": edificioDocument,
            "piso": piso,
        });
    }
}