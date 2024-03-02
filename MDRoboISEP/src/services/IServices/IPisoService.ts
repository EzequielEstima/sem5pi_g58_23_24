import { Result } from "../../core/logic/Result";
import ICriarPisoDTO from "../../dto/ICriarPisoDTO";
import IEditarPisoDTO from "../../dto/IEditarPisoDTO";
import IPisoDTO from "../../dto/IPisoDTO";

export default interface IPisoService  {
  listarPisosComMapa(codigo: string): Promise<Result<IPisoDTO[]>>;
  criarPiso(criarPisoDTO: ICriarPisoDTO): Promise<Result<ICriarPisoDTO>>;
  listarTodosOsPisosDeUmEdificio(codigo: string): Promise<Result<IPisoDTO[]>>;
  editarPiso(editarPisoDTO: IEditarPisoDTO): Promise<Result<IPisoDTO>>;
  //carregarPiso(json : string): Promise<Result<IPisoDTO>>;
  listarPisosServidosPorElevador(codigoEd: string): Promise<Result<IPisoDTO[]>>;
}
