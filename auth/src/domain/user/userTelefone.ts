
import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

interface UserTelefoneProps {
  value: string;
}

export class UserTelefone extends ValueObject<UserTelefoneProps> {
  getValue (): string {
    return this.props.value;
  }
  
  private constructor (props: UserTelefoneProps) {
    super(props);
  }

  public static create(telefone: string): Result<UserTelefone> {
    const guardResult = Guard.againstNullOrUndefined(telefone, 'telefone');
    if (!guardResult.succeeded) {
      return Result.fail<UserTelefone>(guardResult.message);
    }

    const formatGuardResult = Guard.againstInvalidPhoneFormat(telefone, 'telefone');
    if (!formatGuardResult.succeeded) {
      return Result.fail<UserTelefone>(formatGuardResult.message);
    }

    return Result.ok<UserTelefone>(new UserTelefone({ value: telefone }));
  }
}