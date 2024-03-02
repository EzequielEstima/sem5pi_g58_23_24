import { ValueObject } from "../../core/domain/ValueObject"
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";


interface descricaoPisoProps {
    descricao: string;
}

export class DescricaoPiso extends ValueObject<descricaoPisoProps> {
    private constructor (props : descricaoPisoProps) {
        super(props)
    }

    public static create (descricao: string): Result<DescricaoPiso> {
        const guard1 = Guard.againstNullOrUndefined(descricao,'Descrição do piso');
        const guard2 = Guard.stringLengthLessOrEqualThan(descricao,255,'Descrição do piso');
        const guardResult = Guard.combine([guard1, guard2]);
        if (!guardResult.succeeded) {
          return Result.fail<DescricaoPiso>(guardResult.message);
        } else {
          return Result.ok<DescricaoPiso>(new DescricaoPiso({ descricao: descricao}))
        }
      }

}