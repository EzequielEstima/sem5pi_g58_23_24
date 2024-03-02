import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";



export class IdPonto extends UniqueEntityID {
    private constructor (num : number) {
      super(num)
    }

    public static create (id: number): Result<IdPonto> {
      const guard1 = Guard.againstNullOrUndefined(id,'Id Ponto');
      const guard2 = Guard.numberGreaterThanZero(id,'Id Ponto');
      const guardResult = Guard.combine([guard1, guard2]);
      if (!guardResult.succeeded) {
        return Result.fail<IdPonto>(guardResult.message);
      } else {
        return Result.ok<IdPonto>(new IdPonto(id))
      }
    }
}