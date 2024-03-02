import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";
interface DimensaoProps{
    x : number;
    y : number;
}
export class Dimensao extends ValueObject<DimensaoProps> {
    constructor (props: DimensaoProps){
        super(props);
    }
    public static create (xNumber : number, yNumber : number): Result<Dimensao> {
      let guardResults : any[] = [];
      guardResults.push(Guard.againstNullOrUndefined(xNumber,'Dimensão X'));
      guardResults.push(Guard.againstNullOrUndefined(yNumber,'Dimensão Y'));
      guardResults.push(Guard.numberGreaterThanZero(xNumber,'Dimensão X'));
      guardResults.push(Guard.numberGreaterThanZero(yNumber,'Dimensão Y'));
      let guardFinal = Guard.combine(guardResults);
      if (guardFinal.succeeded === false) {
        return Result.fail<Dimensao>('Erro: A Dimensão tem de ser válida e superior a 0')
      } else {
        const dimensao = new Dimensao({ x: xNumber, y:yNumber});
        return Result.ok<Dimensao>( dimensao );
      }
    }
}