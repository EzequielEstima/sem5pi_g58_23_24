import { is } from "shallow-equal-object";
import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";

interface TipoTarefaProps {
    tipoTarefa: string;
}
export class TipoTarefa extends ValueObject<TipoTarefaProps> {
    private constructor(props: TipoTarefaProps){
        super(props);
    }
    public static create (tipoTarefaString:string): Result<TipoTarefa>{
        let tipoTarefaEnum = ['Vigilancia', 'PickUp/Delivery'];
        let isValid : boolean = false;
        let i = 0;
        while(i < tipoTarefaEnum.length && !isValid){
            if(tipoTarefaEnum[i] === tipoTarefaString){
                isValid = true;
            }
            i++;
        }
        if(!isValid){
            return Result.fail<TipoTarefa>('Erro: O tipo de tarefa não é válido.');
        }
        const tipoTarefa = new TipoTarefa({tipoTarefa: tipoTarefaString});
        return Result.ok<TipoTarefa>(tipoTarefa);
    }
}