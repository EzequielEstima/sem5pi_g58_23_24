import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";


export class IdMapa extends UniqueEntityID {
    private constructor (num : number) {
      super(num)
    }

    public static create (id: number): Result<IdMapa> {
      const guard1 = Guard.againstNullOrUndefined(id,'Id Mapa');
      const guard2 = Guard.numberGreaterThanZero(id,'Id Mapa');
      const guardResult = Guard.combine([guard1, guard2]);
      if (!guardResult.succeeded) {
        return Result.fail<IdMapa>(guardResult.message);
      } else {
        return Result.ok<IdMapa>(new IdMapa(id))
      }
    }
}