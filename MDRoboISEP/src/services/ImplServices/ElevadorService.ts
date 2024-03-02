import IElevadorService from "../IServices/IElevadorService";
import { Result } from "../../core/logic/Result";
import { Inject, Service } from "typedi";
import IElevadorRepo from "../IRepos/IElevadorRepo";
import IEdificioRepo from "../IRepos/IEdificioRepo";
import config from "../../../config";
import ICriarElevadorDTO from "../../dto/ICriarElevadorDTO";
import { Piso } from "../../domain/piso/Piso";
import { IdElevador } from "../../domain/elevador/IdElevador";
import { MarcaElevador } from "../../domain/elevador/MarcaElevador";
import { ModeloElevador } from "../../domain/elevador/ModeloElevador";
import { NumeroSerieElevador } from "../../domain/elevador/NumeroSerieElevador";
import { DescricaoElevador } from "../../domain/elevador/DescricaoElevador";
import { Elevador } from "../../domain/elevador/Elevador";
import IElevadorDTO from "../../dto/IElevadorDTO";
import { ElevadorMap } from "../../mappers/ElevadorMap";


@Service()
export default class ElevadorService implements IElevadorService{
    
    constructor(
        @Inject(config.repos.edificio.name) private edificioRepo : IEdificioRepo,
        @Inject(config.repos.elevador.name) private elevadorRepo : IElevadorRepo,
    ){}
    
    
    public async criarElevador(elevadorDTO: ICriarElevadorDTO): Promise<Result<ICriarElevadorDTO>>{
        try {
            
            let edificio = await this.edificioRepo.findByDomainId(elevadorDTO.edificio);

            if (edificio === null){
                return Result.fail<ICriarElevadorDTO>("Edificio não existe.")
            }
            if (edificio.temElevador()){
                return Result.fail<ICriarElevadorDTO>("Edificio já tem um elevador.")
            }
            
            // Procurar os pisos do edifício com número correspondente aos passados por parâmetro

            let pisosServidos = edificio.pisosCorrespondentes(elevadorDTO.pisosServidos);
            
            // Se náo forem encontrados todos os pisos, quer dizer que foram inseridos pisos inválidos
            if(pisosServidos.length !== elevadorDTO.pisosServidos.length){
                return Result.fail<ICriarElevadorDTO>("Foram inseridos pisos inválidos")
            }

            let id = await this.elevadorRepo.getMaxId();

            let idElevadorOrError = IdElevador.create(id+1);
            if(idElevadorOrError.isFailure){
                return Result.fail<ICriarElevadorDTO>(idElevadorOrError.errorValue());
            }
            
            let marcaOrError = MarcaElevador.create(elevadorDTO.marca);
            let modeloOrError = ModeloElevador.create(elevadorDTO.modelo);
            let numeroSerieOrError = NumeroSerieElevador.create(elevadorDTO.numeroSerie);
            let descricaoOrError = DescricaoElevador.create(elevadorDTO.descricao);

            let finalResult = Result.combine([marcaOrError,modeloOrError,numeroSerieOrError,descricaoOrError]);

            if (finalResult.isFailure){
                return Result.fail<ICriarElevadorDTO>(finalResult.errorValue());
            }
            
            const elevadorOuErro = await Elevador.create({
                pisosServidos: pisosServidos,
                marca: marcaOrError.getValue(),
                modelo: modeloOrError.getValue(),
                numeroSerie: numeroSerieOrError.getValue(),
                descricao: descricaoOrError.getValue(),
            }, idElevadorOrError.getValue());
    
            if (elevadorOuErro.isFailure) {
                return Result.fail<ICriarElevadorDTO>(elevadorOuErro.errorValue());
            }

            edificio.adicionarElevador(elevadorOuErro.getValue());

            await this.elevadorRepo.save(elevadorOuErro.getValue());
            await this.edificioRepo.save(edificio)

            return Result.ok<ICriarElevadorDTO>(elevadorDTO)

        } catch (e) {
            throw e;
        }
    }
        
    public async editarElevador(elevadorDTO: ICriarElevadorDTO): Promise<Result<ICriarElevadorDTO>>{
        try {
            let edificio = await this.edificioRepo.findByDomainId(elevadorDTO.edificio);

            if (edificio === null){
                return Result.fail<ICriarElevadorDTO>("Edificio não existe.")
            }

            let elevador = edificio.returnElevador();
            
            if (elevador === null){
                return Result.fail<ICriarElevadorDTO>("Elevador não existe.")
            }

            var pisosServidos: Piso[] = [];

            if (elevadorDTO.pisosServidos !== undefined){
                // Procurar os pisos do edifício com número correspondente aos passados por parâmetro
                pisosServidos = edificio.pisosCorrespondentes(elevadorDTO.pisosServidos);

                // Se náo forem encontrados todos os pisos, quer dizer que foram inseridos pisos inválidos
                if(pisosServidos.length !== elevadorDTO.pisosServidos.length){
                    return Result.fail<ICriarElevadorDTO>("Foram inseridos pisos inválidos")
                }

                elevador.updatePisos(pisosServidos);
            }
            
            if (elevadorDTO.marca !== undefined){
                let marcaOrErro = MarcaElevador.create(elevadorDTO.marca);
                if(marcaOrErro.isFailure){
                    return Result.fail<ICriarElevadorDTO>(marcaOrErro.errorValue());
                }else{
                    elevador.updateMarca(marcaOrErro.getValue());
                }
            }

            if (elevadorDTO.modelo !== undefined){
                let modeloOrErro = ModeloElevador.create(elevadorDTO.modelo);
                if(modeloOrErro.isFailure){
                    return Result.fail<ICriarElevadorDTO>(modeloOrErro.errorValue());
                }else{
                    elevador.updateModelo(modeloOrErro.getValue());
                }
            }

            if (elevadorDTO.numeroSerie !== undefined){
                let numeroSerieOrErro = NumeroSerieElevador.create(elevadorDTO.numeroSerie);
                if(numeroSerieOrErro.isFailure){
                    return Result.fail<ICriarElevadorDTO>(numeroSerieOrErro.errorValue());
                }else{
                    elevador.updateNumeroSerie(numeroSerieOrErro.getValue());
                }
            }

            if (elevadorDTO.descricao !== undefined){
                let descricaoOrErro = DescricaoElevador.create(elevadorDTO.descricao);
                if(descricaoOrErro.isFailure){
                    return Result.fail<ICriarElevadorDTO>(descricaoOrErro.errorValue());
                }else{
                    elevador.updateDescricao(descricaoOrErro.getValue());
                }
            }

            this.elevadorRepo.save(elevador);
            
            return Result.ok<ICriarElevadorDTO>(elevadorDTO)
        } catch (e) {
            throw e;
        }
    }

    public async listarElevadoresDoEdificio(codigoEdificio: string): Promise<Result<IElevadorDTO>>{
        try {
            let edificio = await this.edificioRepo.findByDomainId(codigoEdificio);

            if (edificio === null){
                return Result.fail<IElevadorDTO>("Edifício não existe.")
            }
            
            let elevador = edificio.returnElevador();

            if (elevador === null){
                return Result.fail<IElevadorDTO>("O edifício não tem elevadores.")
            }
            
            return Result.ok<IElevadorDTO>(ElevadorMap.toDTO(elevador))
        } catch (e) {
            throw e;
        }
    }
}