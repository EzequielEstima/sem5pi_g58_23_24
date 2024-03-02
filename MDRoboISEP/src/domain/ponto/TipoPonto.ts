import { ValueObject } from "../../core/domain/ValueObject"
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";


interface tipoPontoProps {
    tipoPonto: string;
}

export class TipoPonto extends ValueObject<tipoPontoProps> {
    private constructor (props : tipoPontoProps) {
        super(props)
    }

    public static create (tipoPonto: string): Result<TipoPonto> {
        
        const pontosValidos = ["Elevador", "Norte", "Oeste", " ", "NorteOeste", "PortaNorte", 
        "PortaOeste", "PortaNorteOeste", "PassagemNorte", "PassagemOeste","Sala", "Passagem", "Porta"];
        const guardResult = Guard.isOneOf(tipoPonto, pontosValidos, "tipo de ponto");

        if (!guardResult.succeeded) {
          return Result.fail<TipoPonto>(guardResult.message);   
        } else {
          return Result.ok<TipoPonto>(new TipoPonto({ tipoPonto: tipoPonto}))
        }
    }
}