import { ValueObject } from "../../core/domain/ValueObject"
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";


interface coordenadaProps {
    abscissa: number;
    ordenada: number;
}

export class Coordenadas extends ValueObject<coordenadaProps> {
    private constructor (props : coordenadaProps) {
        super(props)
    }

    public static create (props: coordenadaProps): Result<Coordenadas> {
        
        const guardedProps = [
            { argument: props.abscissa, argumentName: 'abscissa' },
            { argument: props.ordenada, argumentName: 'ordenada' },
          ];
          let guard1 = Guard.againstNullOrUndefinedBulk(guardedProps);
          let guard2 = Guard.numberGreaterOrEqualsZero(guardedProps[0].argument,'abscissa');
          let guard3 = Guard.numberGreaterOrEqualsZero(guardedProps[1].argument,'ordenada');
          const guardResult = Guard.combine([guard1,guard2,guard3]);
      
          if (!guardResult.succeeded) {
            return Result.fail<Coordenadas>(guardResult.message)
          }     
          else {
            const coordenadas = new Coordenadas({
              ...props
            });
      
            return Result.ok<Coordenadas>(coordenadas);
        }
    }
}