import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";

export class IdElevador extends UniqueEntityID{

    private constructor (num: number) {
        super (num);
    }

    public static create (id: number): Result<IdElevador> {
        const guardResult = Guard.numberGreaterThanZero(id,'Id elevador');
        if (!guardResult.succeeded) {
          return Result.fail<IdElevador>(guardResult.message);
        } else {
          return Result.ok<IdElevador>(new IdElevador(id))
        }
    }

}