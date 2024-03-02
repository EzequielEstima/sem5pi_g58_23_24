import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";


export default class NomeSala extends UniqueEntityID{
  private constructor(props:string){
      super(props);
  }

  /**
   * 
   * @param id 
   * @returns 
   */
  public static create (id: string): Result<NomeSala> {
    let guardResults: any[] = [];
    guardResults.push(Guard.againstNullOrUndefined(id, "id"));
    guardResults.push(Guard.stringLengthLessOrEqualThan(id, 50, "id"));
    let guardFinal = Guard.combine(guardResults);
    if(guardFinal.succeeded === false){
      return Result.fail<NomeSala>(guardFinal.message);
    }
    const idPassagem = new NomeSala(id);
    return Result.ok<NomeSala>(idPassagem);
  }
}