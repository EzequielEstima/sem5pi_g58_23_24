import { ValueObject } from "../../core/domain/ValueObject"
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";

interface numeroPisoProps {
    nPiso: number ;
}

export class NumeroPiso extends ValueObject<numeroPisoProps> {
    private constructor (props : numeroPisoProps) {
        super(props)
    }

    public static create (nPiso: number): Result<NumeroPiso> {
        const guardResult = Guard.againstNullOrUndefined(nPiso,'Número do piso');
        if (!guardResult.succeeded) {
          return Result.fail<NumeroPiso>(guardResult.message);
        } else {
          return Result.ok<NumeroPiso>(new NumeroPiso({ nPiso: nPiso}))
        }
    }

}