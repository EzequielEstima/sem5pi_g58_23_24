import { ValueObject } from "../../core/domain/ValueObject";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";

interface MarcaElevadorProps{
    marca : string; 
}

export class MarcaElevador extends ValueObject<MarcaElevadorProps>{
    private constructor (props : MarcaElevadorProps) {
        super(props)
    }

    public static create(marca : string): Result<MarcaElevador>{
        
        let guardResults : any[] = [];
        guardResults.push(Guard.stringLengthLessOrEqualThan(marca,50,"Marca do elevador"));
        guardResults.push(Guard.isAlphanumeric(marca,"Marca do elevador"));
        
        const finalGuard = Guard.combine(guardResults);

        if (!finalGuard.succeeded) {
            return Result.fail<MarcaElevador>(finalGuard.message);
        } else {
            return Result.ok<MarcaElevador>(new MarcaElevador({ marca : marca}))
        }
    }
}