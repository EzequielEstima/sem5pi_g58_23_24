
import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

interface UserNameProps {
    name: string;
}

export class UserName extends ValueObject<UserNameProps> {
    getValue(): string {
        return this.props.name;
    }

    private constructor(props: UserNameProps) {
        super(props);
    }

    public static create(name: string): Result<UserName> {
        const nullOrUndefinedResult = Guard.againstNullOrUndefined(name, 'nome');
        if (!nullOrUndefinedResult.succeeded) {
            return Result.fail<UserName>(nullOrUndefinedResult.message);
        }

        const validUsernameResult = Guard.againstInvalidUsername(name, 'nome');
        if (!validUsernameResult.succeeded) {
            return Result.fail<UserName>(validUsernameResult.message);
        }

        return Result.ok<UserName>(new UserName({ name: name }));
    }
}