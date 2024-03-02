import { ValueObject } from "../../core/domain/ValueObject"
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";


export class CodigoDispositivo extends UniqueEntityID {
    private constructor (codigo : string) {
        super(codigo)
    }

    public static create (codigo: string): Result<CodigoDispositivo> {
        let guardResults: any[] = [];
        guardResults.push(Guard.isAlphanumeric(codigo,'Código do Dispositivo'));
        guardResults.push(Guard.stringLengthLessOrEqualThan(codigo,30,'Código do Dispositivo'));
        guardResults.push(Guard.againstNullOrUndefined(codigo,'Código do Dispositivo'));
        let guardFinal = Guard.combine(guardResults);        
        if (!guardFinal.succeeded) {
          return Result.fail<CodigoDispositivo>(guardFinal.message);
        } else {
          return Result.ok<CodigoDispositivo>(new CodigoDispositivo(codigo))
        }
    }

}