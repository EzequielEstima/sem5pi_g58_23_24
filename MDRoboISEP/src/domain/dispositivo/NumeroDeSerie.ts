import { ValueObject } from "../../core/domain/ValueObject"
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

interface numeroDeSerieProps {
    numeroSerie: string;
}

export class NumeroDeSerie extends ValueObject<numeroDeSerieProps> {
    private constructor (props : numeroDeSerieProps) {
        super(props)
    }

    public static create (numeroSerie: string): Result<NumeroDeSerie> {
        let guardResults: any[] = [];
        guardResults.push(Guard.isAlphanumeric(numeroSerie,'Numero De Serie do Dispositivo'));
        guardResults.push(Guard.stringLengthLessOrEqualThan(numeroSerie,30,'Numero De Serie do Dispositivo'));
        guardResults.push(Guard.againstNullOrUndefined(numeroSerie,'Numero De Serie do Dispositivo'));
        let guardFinal = Guard.combine(guardResults);        
        if (!guardFinal.succeeded) {
          return Result.fail<NumeroDeSerie>(guardFinal.message);
        } else {
          return Result.ok<NumeroDeSerie>(new NumeroDeSerie({ numeroSerie: numeroSerie}))
        }
    }

}