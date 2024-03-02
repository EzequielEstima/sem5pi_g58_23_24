import { ValueObject } from "../../core/domain/ValueObject"
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

interface estadoDispositivoProps {
    estado: boolean;
}

export class EstadoDispositivo extends ValueObject<estadoDispositivoProps> {
    private constructor (props : estadoDispositivoProps) {
        super(props)
    }

    public static create (estado: boolean): Result<EstadoDispositivo> {
        let guardResults = Guard.againstNullOrUndefined(estado,'Estado do Dispositivo');       
        if (!guardResults.succeeded) {
          return Result.fail<EstadoDispositivo>(guardResults.message);
        } else {
          return Result.ok<EstadoDispositivo>(new EstadoDispositivo({ estado: estado}))
        }
    }

}