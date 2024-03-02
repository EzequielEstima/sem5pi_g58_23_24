import { ValueObject } from "../../core/domain/ValueObject";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";

interface MarcaProps {
    marca: string;
}

export class Marca extends ValueObject<MarcaProps> {
    private constructor(props: MarcaProps){
        super(props);
    }
    public static create (marcaString: string): Result<Marca> {
        let guardResults : any[] = [];
        guardResults.push(Guard.againstNullOrUndefined(marcaString,'Marca'));
        guardResults.push(Guard.isAlphanumericWithSpaces(marcaString,'Marca'));
        guardResults.push(Guard.stringLengthLessOrEqualThan(marcaString,50,'Marca'));
        const guardFinal = Guard.combine(guardResults);
        if(guardFinal.succeeded === false || !marcaString){
            return Result.fail<Marca>('Erro: A marca tem de ser válida e ter até 50 caratéres.')
        }else{
            const marca = new Marca({marca: marcaString});
            return Result.ok<Marca>(marca);
        }
    }
}