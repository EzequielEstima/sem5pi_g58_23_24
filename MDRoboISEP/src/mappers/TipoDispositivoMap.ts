import { Mapper } from "../core/infra/Mapper";
import { Result } from "../core/logic/Result";
import { IdTipoDispositivo } from "../domain/tipoDispositivo/IdTipoDispositivo";
import { Marca } from "../domain/tipoDispositivo/Marca";
import { Modelo } from "../domain/tipoDispositivo/Modelo";
import { TipoDispositivo } from "../domain/tipoDispositivo/TipoDispositivo";
import { TipoTarefa } from "../domain/tipoDispositivo/TipoTarefa";
import ITipoDispositivoDTO from "../dto/ITipoDispositivoDTO";

export class TipoDispositivoMap extends Mapper <TipoDispositivoMap>{
    public static toDTO (tipoDispositivo: TipoDispositivo): ITipoDispositivoDTO {
        return {
            idTipoDispositivo: Number (tipoDispositivo.id.toValue()),
            tipoTarefa: tipoDispositivo.returnTipoTarefa(),
            marca: tipoDispositivo.returnMarca(),
            modelo: tipoDispositivo.returnModelo()
        }as ITipoDispositivoDTO;
    }

    public static async toDomain(raw:any): Promise<TipoDispositivo>{
        let listaTipoTarefaOrError : Result<TipoTarefa>[] = [];
        let listaTipoTarefa : TipoTarefa[] = [];
        for(let i = 0; i < raw.tipoTarefa.length; i++){
            listaTipoTarefaOrError[i] = TipoTarefa.create(raw.tipoTarefa[i]);
            if(listaTipoTarefaOrError[i].isFailure){
                return null;
            }
            listaTipoTarefa.push(listaTipoTarefaOrError[i].getValue());
        }
        const marcaOrError = Marca.create(raw.marca);
        const modeloOrError = Modelo.create(raw.modelo);
        const idOrError = IdTipoDispositivo.create(raw.idTipoDispositivo);
        if(marcaOrError.isFailure || modeloOrError.isFailure || idOrError.isFailure){
            return null;
        }
        const tipoDispositivoOrError = TipoDispositivo.create({
            tipoTarefa: listaTipoTarefa,
            marca: marcaOrError.getValue(),
            modelo: modeloOrError.getValue()
        },idOrError.getValue());

        tipoDispositivoOrError.isFailure ? console.log(tipoDispositivoOrError.error) : '';

        return tipoDispositivoOrError.isSuccess ? tipoDispositivoOrError.getValue() : null;
    }

    public static toPersistence (tipoDispositivo: TipoDispositivo): any {
        return {
            idTipoDispositivo: tipoDispositivo.id.toValue(),
            tipoTarefa: tipoDispositivo.returnTipoTarefa(),
            marca: tipoDispositivo.returnMarca(),
            modelo: tipoDispositivo.returnModelo()
        }
    }
}