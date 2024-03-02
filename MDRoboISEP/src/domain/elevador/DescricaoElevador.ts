import { ValueObject } from "../../core/domain/ValueObject";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";

interface DescricaoElevadorProps{
    descricao : string;
}

export class DescricaoElevador extends ValueObject<DescricaoElevadorProps>{
    private constructor (props : DescricaoElevadorProps) {
        super(props)
    }

    public static create(descricao : string): Result<DescricaoElevador>{
        
        let guardResults : any[] = [];
        guardResults.push(Guard.stringLengthLessOrEqualThan(descricao,250,"Descrição do elevador"));
        guardResults.push(Guard.isAlphanumeric(descricao,"Descrição do elevador"));
        
        const finalGuard = Guard.combine(guardResults);

        if (!finalGuard.succeeded) {
            return Result.fail<DescricaoElevador>(finalGuard.message);
        } else {
            return Result.ok<DescricaoElevador>(new DescricaoElevador({ descricao : descricao}))
        }
    }
}