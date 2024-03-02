import { ValueObject } from "../../core/domain/ValueObject";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

interface RoleProps {
  tipo: string;
}

export class Role extends ValueObject<RoleProps> {

  private constructor (props: RoleProps) {
    super(props);
  }


  getValue(): string {
    return this.props.tipo;
  }
  
  public static create(tipo: string): Result<Role> {
    const nullOrUndefinedResult = Guard.againstNullOrUndefined(tipo, 'role');
    if (!nullOrUndefinedResult.succeeded) {
      return Result.fail<Role>(nullOrUndefinedResult.message);
    }

    const validRoles = ['gestor de campus', 'gestor de frota', 'gestor de tarefas', 'utente', 'admin'];
    const validRoleResult = Guard.isOneOf(tipo, validRoles, 'role');
    if (!validRoleResult.succeeded) {
      return Result.fail<Role>(validRoleResult.message);
    }

    return Result.ok<Role>(new Role({ tipo: tipo }));
  }
}
