import { ValueObject } from "../../core/domain/ValueObject"
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";


interface categorizacaoProps {
    categorizacao: string;
}

export default class Categorizacao extends ValueObject<categorizacaoProps> {
    private constructor (props : categorizacaoProps) {
        super(props)
    }

    public static create (titulo: string): Result<Categorizacao> {
        
        const categorizacao = ["Gabinete", "Anfiteatro", "Laboratorio", "Outro"];
        const guardResult = Guard.isOneOf(titulo, categorizacao, "categorizacao");

        if (!guardResult.succeeded) {
          return Result.fail<Categorizacao>(guardResult.message);   
        } else {
          return Result.ok<Categorizacao>(new Categorizacao({ categorizacao: titulo}))
        }
    }
}