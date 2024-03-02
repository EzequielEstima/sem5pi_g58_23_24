import { ValueObject } from "../../core/domain/ValueObject";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";

interface ModeloElevadorProps{
    modelo : string; 
}

export class ModeloElevador extends ValueObject<ModeloElevadorProps>{
    private constructor (props : ModeloElevadorProps) {
        super(props)
    }

    public static create(modelo : string): Result<ModeloElevador>{
        
        let guardResults : any[] = [];
        guardResults.push(Guard.stringLengthLessOrEqualThan(modelo,50,"Modelo do elevador"));
        guardResults.push(Guard.isAlphanumeric(modelo,"Modelo do elevador"));
        
        const finalGuard = Guard.combine(guardResults);

        if (!finalGuard.succeeded) {
            return Result.fail<ModeloElevador>(finalGuard.message);
        } else {
            return Result.ok<ModeloElevador>(new ModeloElevador({ modelo : modelo}))
        }
    }
}