import { Result } from "../../core/logic/Result";
import ICoordenadasPontosDTO from "../../dto/ICoordenadasPontosDTO";
import IEdificioDTO from "../../dto/IEdificioDTO";
import IListarEdMinEMaxPisosDTO from "../../dto/IListarEdMinEMaxPisosDTO";
import IPlaneamentoCaminhosDTO from "../../dto/IPlaneamentoCaminhosDTO";

export default interface IEdificioService  {
    getInformacaoPlaneamento(ICoordenadasPontosDTO: ICoordenadasPontosDTO): Promise<Result<IPlaneamentoCaminhosDTO>>;
    criarEdificio(edificioDTO: IEdificioDTO): Promise<Result<IEdificioDTO>>;
    listarEdificioMinEMaxPisos(listarEdificioMinEMaxPisosDTO: IListarEdMinEMaxPisosDTO): Promise<Result<IEdificioDTO[]>>;
    listarEdificios(): Promise<Result<IEdificioDTO[]>>;
    editarEdificio(edificioDTO: IEdificioDTO): Promise<Result<IEdificioDTO>>;
    deleteEdificio(codigo: string): Promise<Result<IEdificioDTO>>;
}
