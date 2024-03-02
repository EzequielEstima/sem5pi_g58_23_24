import { Result } from "../../core/logic/Result";
import ICarregarMapaDTO from "../../dto/ICarregarMapaDTO";

export default interface IPontoService {
    carregarMapa(json : ICarregarMapaDTO) : Promise<Result<ICarregarMapaDTO>>;
}