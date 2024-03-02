import { ValueObject } from "../../core/domain/ValueObject"
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";



interface coordenadasPassagemProps {
  id : number;
  abcissaSup : number;
  ordenadaSup : number;
  abcissaInf : number;
  ordenadaInf : number;
  orientacao : string;
}

export class CoordenadasPassagem extends ValueObject<coordenadasPassagemProps> {
  isPassagem(arg0: number) {
    if (this.props.id == arg0) {
      return true;
    }
  }
  private constructor (props : coordenadasPassagemProps) {
    super(props)
  }

  public static create (props: coordenadasPassagemProps): Result<CoordenadasPassagem> {

  const guardedProps = [
    { argument: props.id, argumentName: 'id' },
    { argument: props.abcissaSup, argumentName: 'abcissaSup' },
    { argument: props.ordenadaSup, argumentName: 'ordenadaSup' },
    { argument: props.abcissaInf, argumentName: 'abcissaInf' },
    { argument: props.ordenadaInf, argumentName: 'ordenadaInf' },
    { argument: props.orientacao, argumentName: 'orientacao' },
  ];
    
    const guard1 = Guard.againstNullOrUndefinedBulk(guardedProps);
    const guardResult = Guard.combine([guard1]);
    if (!guardResult.succeeded) {
      return Result.fail<CoordenadasPassagem>(guardResult.message);
    } else {
      return Result.ok<CoordenadasPassagem>(new CoordenadasPassagem({ ...props}))
    }
  }

  public returnId(): number {
    return this.props.id;
  }
  public returnAbcissaSup(): number {
    return this.props.abcissaSup;
  }
  public returnOrdenadaSup(): number {
    return this.props.ordenadaSup;
  }

  public returnAbcissaInf(): number {
    return this.props.abcissaInf;
  }
  public returnOrdenadaInf(): number {
    return this.props.ordenadaInf;
  }
  public returnOrientacao(): string {
    return this.props.orientacao;
  }

}