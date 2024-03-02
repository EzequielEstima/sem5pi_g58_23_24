import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";


export class IdPassagem extends UniqueEntityID{
  private constructor(props:number){
      super(props);
  }

  /**
   * This method creates a new IdPassagem object instance from a string passed as parameter. 
   * It also validates the string format and length before returning the object.
   * @param id 
   * @returns Result of type IdPassagem
   */
  public static create (id: number): Result<IdPassagem> {
    let guardResults: any[] = [];
    guardResults.push(Guard.againstNullOrUndefined(id, "id"));
    guardResults.push(Guard.numberGreaterThanZero(id, "id"));
    let guardFinal = Guard.combine(guardResults);
    if(guardFinal.succeeded === false){
      return Result.fail<IdPassagem>(guardFinal.message);
    }
    const idPassagem = new IdPassagem(id);
    return Result.ok<IdPassagem>(idPassagem);
  }
}