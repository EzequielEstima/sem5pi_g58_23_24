
import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

interface UserEstadoProps {
  estado: string;
}

export class UserEstado extends ValueObject<UserEstadoProps> {
  getValue (): string {
    return this.props.estado;
  }
  
  private constructor (props: UserEstadoProps) {
    super(props);
  }

  public static create(estado: string): Result<UserEstado> {
    const nullOrUndefinedResult = Guard.againstNullOrUndefined(estado, 'estado');
    if (!nullOrUndefinedResult.succeeded) {
      return Result.fail<UserEstado>(nullOrUndefinedResult.message);
    }

    const validStates = ['aceito', 'pendente', 'rejeitado'];
    const validStateResult = Guard.isOneOf(estado, validStates, 'estado');
    if (!validStateResult.succeeded) {
      return Result.fail<UserEstado>(validStateResult.message);
    }

    return Result.ok<UserEstado>(new UserEstado({ estado: estado }));
  }
}