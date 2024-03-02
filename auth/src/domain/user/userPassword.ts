import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";
import * as bcrypt from 'bcrypt-nodejs';
import * as argon2 from 'argon2';
import { randomBytes } from 'crypto';
import { has } from "lodash";



interface UserPasswordProps {
  value: string;
  hashed?: boolean;
}

export class UserPassword extends ValueObject<UserPasswordProps> {

  getValue(): string {
    return this.props.value;
  }

  private constructor(props) {
    super(props)
  }

  /**
 * @method comparePassword
 * @desc Compares as plain-text and hashed password.
 */

  public async comparePassword(plainTextPassword: string): Promise<boolean> {
    let hashed: string;
    if (this.isAlreadyHashed()) {
      hashed = this.props.value;
      return this.bcryptCompare(plainTextPassword, hashed);
    } else {
      return this.props.value === plainTextPassword;
    }
  }

  private bcryptCompare(plainText: string, hashed: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      bcrypt.compare(plainText, hashed, (err, compareResult) => {
        if (err) return resolve(false);
        return resolve(compareResult);
      })
    })
  }

  public isAlreadyHashed(): boolean {
    return this.props.hashed;
  }

  private hashPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, null, null, (err, hash) => {
        if (err) return reject(err);
        resolve(hash)
      })
    })
  }

  public getHashedValue(): Promise<string> {
    return new Promise((resolve) => {
      if (this.isAlreadyHashed()) {
        return resolve(this.props.value);
      } else {
        return resolve(this.hashPassword(this.props.value))
      }
    })
  }

  public static async create(props: UserPasswordProps): Promise<Result<UserPassword>> {
    const password = props.value;
    let hashedPassword: string = null;
    if (props.hashed || props.hashed === false) {
      hashedPassword = password;
    }
    else {
      const nullOrUndefinedResult = Guard.againstNullOrUndefined(password, 'password');
      const passwordLengthResult = Guard.isPasswordGreaterOrEqualThan(password, 10);
      const passwordUppercaseResult = Guard.passwordContainsUppercaseLetter(password);
      const passwordLowercaseResult = Guard.passwordContainsLowercaseLetter(password);
      const passwordDigitResult = Guard.passwordContainsDigit(password);
      const passwordSymbolResult = Guard.passwordContainsSymbol(password);
      const result = Guard.combine([nullOrUndefinedResult, passwordLengthResult, passwordUppercaseResult, passwordLowercaseResult, passwordDigitResult, passwordSymbolResult]);

      if (!result.succeeded) {
        return Result.fail<UserPassword>(result.message);
      }

      const salt = randomBytes(32);
      hashedPassword = await argon2.hash(password, { salt });
    }
    return Result.ok<UserPassword>(new UserPassword({
      value: hashedPassword,
      hashed: true
    }));
  }
}
