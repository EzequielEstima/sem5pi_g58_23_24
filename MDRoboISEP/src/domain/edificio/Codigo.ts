import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";


export class Codigo extends UniqueEntityID{
  private constructor(props:string){
      super(props);
  }

  public static create (codigoString: string): Result<Codigo> {
    let guardResults: any[] = [];
    guardResults.push(Guard.isAlphanumericWithSpaces(codigoString,'Código do Edifício'));
    guardResults.push(Guard.stringLengthLessOrEqualThan(codigoString,5,'Código do Edifício'));
    guardResults.push(Guard.againstNullOrUndefined(codigoString,'Código do Edifício'));
    let guardFinal = Guard.combine(guardResults);
    if(guardFinal.succeeded === false){
      return Result.fail<Codigo>(guardFinal.message);
    }
    const codigo = new Codigo(codigoString);
    return Result.ok<Codigo>( codigo );
  }
}
