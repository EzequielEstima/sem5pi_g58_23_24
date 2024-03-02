import { Result } from "../../core/logic/Result";
import { IApproveOrRejectSignUpDTO } from "../../dto/IApproveOrRejectUtenteDTO";
import { ISignupUtenteDTO } from "../../dto/ISignupUtenteDTO";
import { IUpdateUserDTO } from "../../dto/IUpdateUserDTO";
import { IUserDTO } from "../../dto/IUserDTO";
import { IDadosPessoaisDTO } from "../../dto/IDadosPessoaisDTO";

export default interface IUserService  {
  SignUp(userDTO: IUserDTO): Promise<Result<String>>;
  approveOrRejectSignUp(user: IApproveOrRejectSignUpDTO): Promise<Result<String>>;
  listarUtilizadoresPendentes(): Promise<Result<IUserDTO[]>>;
  SignIn(email: string, password: string): Promise<Result<{ token: string }>>;
  signupUtente(signupUtente: ISignupUtenteDTO): Promise<Result<String>>;
  delete(email: string): Promise<Result<IUserDTO>>;
  alterarDadosUser(updateUserDTO: IUpdateUserDTO): Promise<Result<IUpdateUserDTO>>;
  deleteUtente(email: string): Promise<Result<String>>;
  copiaDadosPessoais(email:string):Promise<Result<IDadosPessoaisDTO>>
}
