import { Mapper } from "../core/infra/Mapper";
import { IUserDTO } from "../dto/IUserDTO";
import { User } from "../domain/user/user";
import { Result } from "../core/logic/Result";
import { Role } from "../domain/user/role";
import { UserEmail } from "../domain/user/userEmail";
import { UserEstado } from "../domain/user/userEstado";
import { UserName } from "../domain/user/userName";
import { UserNumeroContribuinte } from "../domain/user/userNumeroContribuinte";
import { UserPassword } from "../domain/user/userPassword";
import { UserTelefone } from "../domain/user/userTelefone";


export class UserMap extends Mapper<User> {

  public static toDTOList(userDocument: User[]) {
    const userDTOList: IUserDTO[] = [];
    userDocument.forEach((user) => {
      userDTOList.push(this.toDTOEmail(user));
    });
    return userDTOList;
  }

  public static toDTOEmail(user: User): IUserDTO {
    const email = user.getEmail();
    return {
      email: email,
    } as IUserDTO;
  }

  public static toDTO(user: User): IUserDTO {

    const email = user.getEmail();
    const password = user.getPassword();
    const role = user.getRole();
    const estado = user.getEstado();
    const telefone = user.getTelefone();
    const nif = user.getNif();
    const name = user.getName();

    if (nif == null || nif == undefined) {
      return {
        name: name.getValue(),
        email: email,
        telefone: telefone.getValue(),
        nif: null,
        password: password.getValue(),
        estado: estado.getValue(),
        role: role.getValue(),
      } as IUserDTO;
    }
    else {
      return {
        name: name.getValue(),
        email: email,
        telefone: telefone.getValue(),
        nif: nif.getValue(),
        password: password.getValue(),
        estado: estado.getValue(),
        role: role.getValue(),
      } as IUserDTO;
    }
  }

  public static toDTONomeRole(user: User): IUserDTO {

    const role = user.getRole();
    const name = user.getName();

    return {
      name: name.getValue(),
      role: role.getValue(),
    } as IUserDTO;
  }

  public static async toDomain(raw: any): Promise<User> {

    const nameOrError = UserName.create(raw.name);
    const emailOrError = UserEmail.create(raw.email);
    const telefoneOrError = UserTelefone.create(raw.telefone);
    let nifOrError: Result<UserNumeroContribuinte>;
    if (raw.nif) {
      nifOrError = UserNumeroContribuinte.create(raw.nif);
    }
    const passwordOrError = await UserPassword.create({ value: raw.password, hashed: true });
    const estadoOrError = UserEstado.create(raw.estado);
    const roleOrError = Role.create(raw.role);

    let userOrError: Result<User>;
    if (raw.nif) {
      userOrError = User.create(
        {
          name: nameOrError.getValue(),
          telefone: telefoneOrError.getValue(),
          nif: nifOrError.getValue(),
          password: passwordOrError.getValue(),
          estado: estadoOrError.getValue(),
          role: roleOrError.getValue(),
        },
        emailOrError.getValue(),
      );
    }
    else {
      userOrError = User.create(
        {
          name: nameOrError.getValue(),
          telefone: telefoneOrError.getValue(),
          password: passwordOrError.getValue(),
          estado: estadoOrError.getValue(),
          role: roleOrError.getValue(),
        },
        emailOrError.getValue(),
      );
    }
    if (userOrError.isFailure || userOrError == null || userOrError == undefined) {
      return null;
    }
    return userOrError.getValue();
  }

  public static toPersistence(user: User): any {
    if (user.getNif() == null && user.getNif() == undefined) {
      return {
        name: user.getName().getValue(),
        email: user.getEmail(),
        password: user.getPassword().getValue(),
        role: user.getRole().getValue(),
        estado: user.getEstado().getValue(),
        telefone: user.getTelefone().getValue(),
      };
    }
    else {
      return {
        name: user.getName().getValue(),
        email: user.getEmail(),
        password: user.getPassword().getValue(),
        role: user.getRole().getValue(),
        estado: user.getEstado().getValue(),
        telefone: user.getTelefone().getValue(),
        nif: user.getNif().getValue(),
      };
    }
  }
}