import { Result } from "../../core/logic/Result";
import IListarPassagemDTO from "../../dto/IListarPassagemDTO";
import IListarPassagensPorParDeEdificioDTO from "../../dto/IListarPassagensPorParDeEdificioDTO";
import IListarPisoComPassagensDTO from "../../dto/IListarPisoComPassagensDTO";
import IPassagemDTO from "../../dto/IPassagemDTO";

export default interface IPassagemService  {
    editarPassagens(passagemDTO: IPassagemDTO): Promise<Result<IPassagemDTO>>;
    listarPisosComPassagens(): Promise<Result<IListarPisoComPassagensDTO>>;
    criarPassagem(passagemDTO: IPassagemDTO): Promise<Result<IPassagemDTO>>;
    listarPassagensPorParDeEdificios(edificiosDTO: IListarPassagensPorParDeEdificioDTO): Promise<Result<IListarPassagemDTO[]>>;
}
