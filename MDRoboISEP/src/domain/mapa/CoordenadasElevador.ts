import { ValueObject } from "../../core/domain/ValueObject"
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";



interface coordenadasElevadorProps {
    xCoord: number;
    yCoord: number;
    orientacao: string;
}

export class CoordenadasElevador extends ValueObject<coordenadasElevadorProps> {
  private constructor (props : coordenadasElevadorProps) {
    super(props)
  }

  public static create (props: coordenadasElevadorProps): Result<CoordenadasElevador> {

  const guardedProps = [
    { argument: props.xCoord, argumentName: 'xCoord' },
    { argument: props.yCoord, argumentName: 'yCoord' },
    { argument: props.orientacao, argumentName: 'orientacao' },
  ];

    const guard1 = Guard.againstNullOrUndefinedBulk(guardedProps);
    const guardResult = Guard.combine([guard1]);
    if (!guardResult.succeeded) {
      return Result.fail<CoordenadasElevador>(guardResult.message);
    } else {
      return Result.ok<CoordenadasElevador>(new CoordenadasElevador({ ...props}))
    }
  }

  public returnXCoord(): number {
    return this.props.xCoord;
  }
  public returnYCoord(): number {
    return this.props.yCoord;
  }
  public returnOrientacao(): string {
    return this.props.orientacao;
  }
}