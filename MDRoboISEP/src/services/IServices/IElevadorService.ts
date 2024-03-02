import { Result } from "../../core/logic/Result";
import ICriarElevadorDTO from "../../dto/ICriarElevadorDTO";
import IElevadorDTO from "../../dto/IElevadorDTO";


export default interface IElevadorService{
    criarElevador(elevadorDTO: ICriarElevadorDTO): Promise<Result<ICriarElevadorDTO>>;
    editarElevador(elevadorDTO: ICriarElevadorDTO): Promise<Result<ICriarElevadorDTO>>;
    listarElevadoresDoEdificio(codigoEdificio: string): Promise<Result<IElevadorDTO>>;
}