import { ValueObject } from "../../core/domain/ValueObject";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";

interface NumeroSerieElevadorProps{
    numeroSerie : string; 
}

export class NumeroSerieElevador extends ValueObject<NumeroSerieElevadorProps>{
    private constructor (props : NumeroSerieElevadorProps) {
        super(props)
    }

    public static create(numeroSerie : string): Result<NumeroSerieElevador>{
        
        let guardResults : any[] = [];
        guardResults.push(Guard.stringLengthLessOrEqualThan(numeroSerie,50,"Número de série do elevador"));
        guardResults.push(Guard.isAlphanumeric(numeroSerie,"Número de série do elevador"));
        
        const finalGuard = Guard.combine(guardResults);

        if (!finalGuard.succeeded) {
            return Result.fail<NumeroSerieElevador>(finalGuard.message);
        } else {
            return Result.ok<NumeroSerieElevador>(new NumeroSerieElevador({ numeroSerie : numeroSerie}))
        }
    }
}