import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { Result } from "../../core/logic/Result";
import { IdPassagem } from "./IdPassagem";
import { Ponto } from "../ponto/Ponto";
import { Guard } from "../../core/logic/Guard";
import { Piso } from "../piso/Piso";

interface PassagemProps {
  pisoA: Piso;
  pisoB: Piso;
}

export class Passagem extends AggregateRoot<PassagemProps> {
  private constructor(props: PassagemProps, id: IdPassagem) {
    super(props, id);
  }

  public static create(props: PassagemProps, idPassagem: IdPassagem): Result<Passagem> {
    const guardedProps = [ 
      { argument: props.pisoA, argumentName: 'pisoA'},
      { argument: props.pisoB, argumentName: 'pisoB' },
    ];

    let guard1 = Guard.againstNullOrUndefined(guardedProps[0].argument, guardedProps[0].argumentName);
    let guard2 = Guard.againstNullOrUndefined(guardedProps[1].argument, guardedProps[1].argumentName);
    
    let guardResult = Guard.combine([guard1,guard2]);
    //chamar ao ponto uma função que verifica se dois pontos são do mesmo edificio

    if (guardResult.succeeded === false) {
      return Result.fail<Passagem>(guardResult.message);
    } else {
      const passagem = new Passagem({ ...props }, idPassagem);
      return Result.ok<Passagem>(passagem);
    }
  }

  public returnIdPassagem() : number{
    return Number(this._id.toValue());
  }
}