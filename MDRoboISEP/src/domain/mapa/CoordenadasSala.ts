import { ValueObject } from "../../core/domain/ValueObject"
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";



interface coordenadasSalaProps {
  nome: string;
  abcissaA : number;
  ordenadaA : number;
  abcissaB : number;
  ordenadaB : number;
  abcissaPorta : number;
  ordenadaPorta : number;
  orientacaoPorta : string;
}

export class CoordenadasSala extends ValueObject<coordenadasSalaProps> {
  private constructor (props : coordenadasSalaProps) {
    super(props)
  }

  public static create (props: coordenadasSalaProps): Result<CoordenadasSala> {

  const guardedProps = [
    { argument: props.nome, argumentName: 'nome' },
    { argument: props.abcissaA, argumentName: 'abcissaA' },
    { argument: props.ordenadaA, argumentName: 'ordenadaA' },
    { argument: props.abcissaB, argumentName: 'abcissaB' },
    { argument: props.ordenadaB, argumentName: 'ordenadaB' },
    { argument: props.abcissaPorta, argumentName: 'abcissaPorta' },
    { argument: props.ordenadaPorta, argumentName: 'ordenadaPorta' },
    { argument: props.orientacaoPorta, argumentName: 'orientacaoPorta' },
  ];
    const guard1 = Guard.againstNullOrUndefinedBulk(guardedProps);

    const guardResult = Guard.combine([guard1]);
    if (!guardResult.succeeded) {
      return Result.fail<CoordenadasSala>(guardResult.message);
    } else {
      return Result.ok<CoordenadasSala>(new CoordenadasSala({ ...props}))
    }
  }

  public returnNome(): string {
    return this.props.nome;
  }
  public returnAbcissaA(): number {
    return this.props.abcissaA;
  }
  public returnOrdenadaA(): number {
    return this.props.ordenadaA;
  }
  public returnAbcissaB(): number {
    return this.props.abcissaB;
  }
  public returnOrdenadaB(): number {
    return this.props.ordenadaB;
  }
  public returnAbcissaPorta(): number {
    return this.props.abcissaPorta;
  }
  public returnOrdenadaPorta(): number {
    return this.props.ordenadaPorta;
  }
  public returnOrientacaoPorta(): string {
    return this.props.orientacaoPorta;
  }

}