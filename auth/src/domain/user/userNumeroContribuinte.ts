
import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

interface UserNumeroContribuinteProps {
  numero: string;
}

export class UserNumeroContribuinte extends ValueObject<UserNumeroContribuinteProps> {
  getValue(): string {
    return this.props.numero;
  }
  
  private constructor (props: UserNumeroContribuinteProps) {
    super(props);
  }

  public static create(numero: string): Result<UserNumeroContribuinte> {

    const formatGuardResult = Guard.againstInvalidNIF(numero, 'numero de contribuinte');
    if (!formatGuardResult.succeeded) {
      return Result.fail<UserNumeroContribuinte>(formatGuardResult.message);
    }

    return Result.ok<UserNumeroContribuinte>(new UserNumeroContribuinte({ numero: numero }));
  }
}