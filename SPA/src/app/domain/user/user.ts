import { UserName } from "./user.name";
import { Role } from "./user.role";

interface UserProps {
    name: UserName;
    role: Role;
  }

export class User {
    private props: UserProps;

    private constructor(props: UserProps) {
        this.props = props;
    }

    public getName(): UserName {
        return this.props.name;
    }

    public getRole(): Role {
        return this.props.role;
    }

    public static create(props: UserProps): User {
        if (props==null) {
            throw new Error("User props cannot be null");
        }
        return new User(props);
    }
}