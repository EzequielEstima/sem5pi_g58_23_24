import { Repo } from "../../core/infra/Repo";
import { IdTipoDispositivo } from "../../domain/tipoDispositivo/IdTipoDispositivo";
import { TipoDispositivo } from "../../domain/tipoDispositivo/TipoDispositivo";

export default interface ITipoDispositivoRepo extends Repo<TipoDispositivo>{
    save(tipoDispositivo: TipoDispositivo): Promise<TipoDispositivo>;
    findByDomainId(idTipoDispositivo: IdTipoDispositivo| number): Promise<TipoDispositivo>;
    getMaxId(): Promise<number>;
    delete(tipoDispositivo: TipoDispositivo): Promise<boolean>;
}