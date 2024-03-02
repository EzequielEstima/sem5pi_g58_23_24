import { Repo } from "../../core/infra/Repo";
import { User } from "../../domain/user/user";
import { UserEmail } from "../../domain/user/userEmail";

export default interface IUserRepo extends Repo<User> {
	save(user: User): Promise<User>;
	findByEmail (email: UserEmail | string): Promise<User>;
	listarUtilizadoresPendentes(): Promise<User[]>;
	delete(user: User): Promise<boolean>;
}
  