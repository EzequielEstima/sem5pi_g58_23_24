import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Result } from "../../core/logic/Result";
import { UserEmail } from "./userEmail";
import { Role } from "../user/role";
import { UserPassword } from "./userPassword";
import { Guard } from "../../core/logic/Guard";
import { UserTelefone } from "./userTelefone";
import { UserName } from "./userName";
import { UserNumeroContribuinte } from "./userNumeroContribuinte";
import { UserEstado } from "./userEstado";


interface UserProps {
  name: UserName;
  telefone: UserTelefone;
  nif?: UserNumeroContribuinte;
  password: UserPassword;
  estado: UserEstado;
  role: Role;
}

export class User extends AggregateRoot<UserProps> {
  public reject() : boolean {
    this.props.estado = UserEstado.create("rejeitado").getValue();
    return true;
  }
  public aprove() : boolean {
    this.props.estado = UserEstado.create("aceito").getValue();
    return true;
  }

  getEmail(): string {
    return String(this.id.toString());
  }

  getName(): UserName {
    return this.props.name;
  }

  getTelefone(): UserTelefone {
    return this.props.telefone;
  }

  getNif(): UserNumeroContribuinte {
    if (this.props.nif != undefined && this.props.nif != null) {
      return this.props.nif;
    }
    else {
      return null;
    }
  }

  getPassword(): UserPassword {
    return this.props.password;
  }

  getRole(): Role {
    return this.props.role;
  }

  getEstado(): UserEstado {
    return this.props.estado;
  }

  setRole(value: Role) {
    this.props.role = value;
  }

  private constructor(props: UserProps, id?: UserEmail) {
    super(props, id);
  }

  public static create(props: UserProps, id?: UserEmail): Result<User> {

    const guardedProps = [
      { argument: props.name, argumentName: 'name' },
      { argument: props.telefone, argumentName: 'telefone' },
      { argument: props.password, argumentName: 'password' },
      { argument: props.role, argumentName: 'role' },
      { argument: props.estado, argumentName: 'estado' }
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);
    if (!guardResult.succeeded) {
      return Result.fail<User>(guardResult.message)
    }
    else {
      const user = new User({
        ...props
      }, id);

      return Result.ok<User>(user);
    }
  }

  public updateName(name: UserName): void {
    this.props.name = name;
  }

  public updateTelefone(telefone: UserTelefone): void {
    this.props.telefone = telefone;
  }

  public updateNif(nif: UserNumeroContribuinte): void {
    this.props.nif = nif;
  }

  public returnName(): string {
    return this.props.name.props.name;
  }

  public returnTelefone(): string {
    return this.props.telefone.props.value;
  }

  public returnNif(): string | null {
    if(this.props.nif){
      return this.props.nif.props.numero;
    }else{
      return null;
    }
  }

  public returnRole(): string {
    return this.props.role.props.tipo;
  }

  public returnEstado(): string {
    return this.props.estado.props.estado;
  }

}