import { ValueObject } from "../../core/domain/ValueObject"
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

interface descricaoDispositivoProps {
    descricao: string;
}

export class DescricaoDispositivo extends ValueObject<descricaoDispositivoProps> {
    private constructor (props : descricaoDispositivoProps) {
        super(props)
    }

    public static create (descricao: string): Result<DescricaoDispositivo> {
        let guardResults: any[] = [];
        guardResults.push(Guard.isAlphanumericWithSpaces(descricao,'Descrição do Dispositivo'));
        guardResults.push(Guard.stringLengthLessOrEqualThan(descricao,250,'Descrição do Dispositivo'));
        guardResults.push(Guard.againstNullOrUndefined(descricao,'Descrição do Dispositivo'));
        let guardFinal = Guard.combine(guardResults);        
        if (!guardFinal.succeeded) {
          return Result.fail<DescricaoDispositivo>(guardFinal.message);
        } else {
          return Result.ok<DescricaoDispositivo>(new DescricaoDispositivo({ descricao: descricao}))
        }
    }

}