import { ValueObject } from "../../core/domain/ValueObject"
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";



export class IdPiso extends UniqueEntityID {
    private constructor (num : number) {
      super(num)
    }

    public static create (id: number): Result<IdPiso> {
      const guard1 = Guard.againstNullOrUndefined(id,'Id Piso');
      const guard2 = Guard.numberGreaterThanZero(id,'Id Piso');
      const guardResult = Guard.combine([guard1, guard2]);
      if (!guardResult.succeeded) {
        return Result.fail<IdPiso>(guardResult.message);
      } else {
        return Result.ok<IdPiso>(new IdPiso(id))
      }
    }
}