import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

interface ModeloProps{
    modelo: string;
}
export class Modelo extends ValueObject<ModeloProps>{
    private constructor(props: ModeloProps){
        super(props);
    }
    public static create(modeloString: string): Result<Modelo>{
        let guardResults : any[] = [];
        guardResults.push(Guard.againstNullOrUndefined(modeloString,'Modelo'));
        guardResults.push(Guard.isAlphanumericWithSpaces(modeloString,'Modelo'));
        guardResults.push(Guard.stringLengthLessOrEqualThan(modeloString,100,'Modelo'));
        const guardFinal = Guard.combine(guardResults);
        if(guardFinal.succeeded === false || !modeloString){
            return Result.fail<Modelo>('Erro: O modelo tem de ser válido e ter até 100 caratéres.')
        }else{
            const modelo = new Modelo({modelo: modeloString});
            return Result.ok<Modelo>(modelo);
        }
    }
}