import { Service,Inject } from "typedi";
import config from "../../../config";
import ITipoDispositivoService from "../IServices/ITipoDispositivoService";
import ITipoDispositivoDTO from "../../dto/ITipoDispositivoDTO";
import { Result } from "../../core/logic/Result";
import ITipoDispositivoRepo from "../IRepos/ITipoDispositivoRepo";
import { IdTipoDispositivo } from "../../domain/tipoDispositivo/IdTipoDispositivo";
import { TipoTarefa } from "../../domain/tipoDispositivo/TipoTarefa";
import { Marca } from "../../domain/tipoDispositivo/Marca";
import { Modelo } from "../../domain/tipoDispositivo/Modelo";
import { TipoDispositivo } from "../../domain/tipoDispositivo/TipoDispositivo";
import { TipoDispositivoMap } from "../../mappers/TipoDispositivoMap";
import IDispositivoRepo from "../IRepos/IDispositivoRepo";
@Service()

export default class TipoDispositivoService implements ITipoDispositivoService {
    constructor(
        @Inject(config.repos.tipoDispositivo.name) private tipoDispositivoRepo : ITipoDispositivoRepo,
        @Inject(config.repos.dispositivo.name) private dispositivoRepo : IDispositivoRepo
    ){}

    public async criarTipoDispositivo(tipoDispositivoDTO: ITipoDispositivoDTO): Promise<Result<ITipoDispositivoDTO>> {
        try{
            const maxId = await this.tipoDispositivoRepo.getMaxId();                                 // criação do id
            const idOrError = IdTipoDispositivo.create(maxId + 1);
            const marcaOrError = Marca.create(tipoDispositivoDTO.marca);                    
            const modeloOrError = Modelo.create(tipoDispositivoDTO.modelo);
            let tipoTarefaLista : TipoTarefa[] = [];                                        
            for(let i = 0; i < tipoDispositivoDTO.tipoTarefa.length; i++){
                let tipoTarefaOrError = TipoTarefa.create(tipoDispositivoDTO.tipoTarefa[i]);    // criação dos value objects e verificar se estão corretos
                if(tipoTarefaOrError.isFailure){                                                    
                    return Result.fail<ITipoDispositivoDTO>(tipoTarefaOrError.errorValue());
                }
                tipoTarefaLista.push(tipoTarefaOrError.getValue());
            }
            const orErrorList : any [] = [idOrError,marcaOrError,modeloOrError];
            for(let i = 0; i < orErrorList.length; i++){
                if(orErrorList[i].isFailure){                                                       // se não estiverem corretos retorna o erro
                    return Result.fail<ITipoDispositivoDTO>(orErrorList[i].errorValue());
                }
            }
            const tipoDispositivoOrError = TipoDispositivo.create({
                tipoTarefa: tipoTarefaLista,
                marca: marcaOrError.getValue(),                                                         // criação do tipo de dispositivo
                modelo: modeloOrError.getValue()
            },idOrError.getValue());

            if(tipoDispositivoOrError.isFailure){
                return Result.fail<ITipoDispositivoDTO>(tipoDispositivoOrError.errorValue());           // verificar se o tipo de dispositivo foi criado com sucesso
            }
            const tipoDispositivo = tipoDispositivoOrError.getValue();
            await this.tipoDispositivoRepo.save(tipoDispositivo);
            return Result.ok<ITipoDispositivoDTO>(TipoDispositivoMap.toDTO(tipoDispositivo));           // retorna o tipo de dispositivo criado
        }catch(e){
            throw e;
        }
    }

    public async deleteTipoDispositivo(idTipoDispositivo: number): Promise<Result<ITipoDispositivoDTO>> {
        try{
            const tipoDispositivo = await this.tipoDispositivoRepo.findByDomainId(idTipoDispositivo); 
            if(tipoDispositivo === null){
                return Result.fail<ITipoDispositivoDTO>("Tipo de dispositivo não existe");
            }
            let listaDispositivos = await this.dispositivoRepo.listarTodosOsDispositivosDeUmTipo(idTipoDispositivo); 
            for(let dispositivo of listaDispositivos){
                await this.dispositivoRepo.delete(dispositivo);
            }
            await this.tipoDispositivoRepo.delete(tipoDispositivo);                               
            return Result.ok<ITipoDispositivoDTO>(TipoDispositivoMap.toDTO(tipoDispositivo));
        }catch(e){
            throw e;
        }
    }
    
}