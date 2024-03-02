import { ValueObject } from "../../core/domain/ValueObject"
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";


interface descricaoSalaProps {
    descricao: string;
}

export default class DescricaoSala extends ValueObject<descricaoSalaProps> {
    private constructor (props : descricaoSalaProps) {
        super(props)
    }

    public static create (descricao: string): Result<DescricaoSala> {
        const guard1 = Guard.againstNullOrUndefined(descricao,'Descrição do piso');
        const guard2 = Guard.stringLengthLessOrEqualThan(descricao,250,'Descrição do piso');
        const guardResult = Guard.combine([guard1, guard2]);
        if (!guardResult.succeeded) {
          return Result.fail<DescricaoSala>(guardResult.message);
        } else {
          return Result.ok<DescricaoSala>(new DescricaoSala({ descricao: descricao}))
        }
      }

}