import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

export class IdTipoDispositivo extends UniqueEntityID{
    private constructor(props:number){
        super(props);
    }

    public static create (idNumber : number): Result<IdTipoDispositivo> {
        let guardresults: any[] = [];
        guardresults.push(Guard.againstNullOrUndefined(idNumber,'Id do Tipo de Dispositivo'));
        guardresults.push(Guard.numberGreaterThanZero(idNumber,'Id do Tipo de Dispositivo'));
        let guardResult = Guard.combine(guardresults);
        if(guardResult.succeeded === false){
            return Result.fail<IdTipoDispositivo>(guardResult.message);
        }
        const idTipoDispositivo = new IdTipoDispositivo(idNumber);
        return Result.ok<IdTipoDispositivo>(idTipoDispositivo);
    }
}