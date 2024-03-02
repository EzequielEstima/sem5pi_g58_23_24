
import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";

export class UserEmail extends UniqueEntityID {

  private constructor (props: string) {
    super(props);
  }

  public static create (email: string): Result<UserEmail> {
    const guardResult = Guard.againstNullOrUndefined(email, 'email');
    if (!guardResult.succeeded) {
      return Result.fail<UserEmail>(guardResult.message);

    }
    const guardResult2 = Guard.againtInvalidEmail(email, 'email');
    if (!guardResult2.succeeded) {
      return Result.fail<UserEmail>(guardResult2.message);
    }

    const guardResult3 = Guard.isValidDomainName(email, 'dominio');
    if (!guardResult3.succeeded) {
      return Result.fail<UserEmail>(guardResult3.message);
    }
    return Result.ok<UserEmail>(new UserEmail( email ));
  }
}