import { Service, Inject } from 'typedi';

import { Document, Model } from 'mongoose';
import { IUserPersistence } from '../dataschema/IUserPersistence';

import IUserRepo from "../services/IRepos/IUserRepo";
import { User } from "../domain/user/user";
import { UserEmail } from "../domain/user/userEmail";
import { UserMap } from "../mappers/UserMap";

@Service()
export default class UserRepo implements IUserRepo {
  private models: any;

  constructor(
    @Inject('userSchema') private userSchema: Model<IUserPersistence & Document>,
  ) { }

  private createBaseQuery(): any {
    return {
      where: {},
    }
  }

  public async exists(userId: User | string): Promise<boolean> {

    const idX = userId instanceof User ? userId.id.toString() : userId;

    const query = { email: idX };
    const userDocument = await this.userSchema.findOne(query);

    return !!userDocument === true;
  }

  public async save(user: User): Promise<User> {
    const query = { email: user.getEmail() };

    const userDocument = await this.userSchema.findOne(query);

    try {
      if (userDocument === null) {
        const rawUser: any = UserMap.toPersistence(user);

        const userCreated = await this.userSchema.create(rawUser);

        return UserMap.toDomain(userCreated);
      } else {
        userDocument.name = user.getName().getValue();
        userDocument.telefone = user.getTelefone().getValue();
        userDocument.password = user.getPassword().getValue();
        userDocument.role = user.getRole().getValue();
        userDocument.estado = user.getEstado().getValue();
        
        if(userDocument.nif != null){
          userDocument.nif = user.getNif().getValue();
        }
        await userDocument.save();

        return user;
      }
    } catch (err) {
      throw err;
    }
  }

  public async findByEmail(email: UserEmail | string): Promise<User> {
    const query = { email: email.toString() };
    const userRecord = await this.userSchema.findOne(query);

    if (userRecord != null) {
      return UserMap.toDomain(userRecord);
    }
    else
      return null;
  }

  public async listarUtilizadoresPendentes(): Promise<User[]> {
    const query = { estado: "pendente" };
    const userRecords = await this.userSchema.find(query);

    if (userRecords != null) {
      const users = await Promise.all(userRecords.map((item) => UserMap.toDomain(item)));
      return users;
    } else {
      return null;
    }
  }

  public async delete(user: User): Promise<boolean> {
    const query = { email: user.getEmail() };
    const userRecord = await this.userSchema.findOne(query);

    if (userRecord != null) {
      await this.userSchema.deleteOne(query);
      return true;
    }
    else
      return false;
  }

}