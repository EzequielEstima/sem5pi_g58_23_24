import { Result } from "../../core/logic/Result";
import ITipoDispositivoDTO from "../../dto/ITipoDispositivoDTO";

export default interface ITipoDispositivoService {
    criarTipoDispositivo(tipoDispositivoDTO: ITipoDispositivoDTO): Promise<Result<ITipoDispositivoDTO>>;
    deleteTipoDispositivo(idTipoDispositivo: number): Promise<Result<ITipoDispositivoDTO>>;
}