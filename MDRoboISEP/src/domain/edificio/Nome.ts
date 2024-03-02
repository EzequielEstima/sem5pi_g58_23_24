import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

interface NomeProps{
    nome: string;
}
export class Nome extends ValueObject<NomeProps> {
    private constructor(props:NomeProps){
        super(props);
    }

    public static create (nomeString: string): Result<Nome> {
        let guardResults : any[] = [];
        guardResults.push(Guard.stringLengthLessOrEqualThan(nomeString,50,'Nome do Edifício'));
        guardResults.push(Guard.isAlphanumericWithSpaces(nomeString,'Nome do Edifício'));
        guardResults.push(Guard.againstNullOrUndefined(nomeString,'Nome do Edifício'));
        let guardFinal = Guard.combine(guardResults);
        if(guardFinal.succeeded === false || !nomeString) {
            return Result.fail<Nome>('Erro: O nome tem de ser válido, alfanumérico e ter até 50 caratéres.')
        }else{
          const nome = new Nome({ nome: nomeString});
          return Result.ok<Nome>( nome );
        }
    }
}