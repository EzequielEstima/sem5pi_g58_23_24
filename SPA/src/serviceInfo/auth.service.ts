import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, of } from 'rxjs';
import { User } from 'src/app/domain/user/user';
import { map } from 'rxjs';
import { UserModel } from 'src/dataModel/userModel';
import { MessageService } from './message.service';
import { devEnvironment } from 'src/environments/environment.development';
import { Router } from '@angular/router';
import AlterarDadosUtente from 'src/dataModel/alterarDadosUtente';


@Injectable({ providedIn: 'root' })
export class AuthService {

    private userSubject: BehaviorSubject<User | null>;
    public user: Observable<User | null>;
    private loginUrl = devEnvironment.AUTH_API_URL +  "user/login";
    private signUpUrl = devEnvironment.AUTH_API_URL + "user/signup";
    private authUrl = devEnvironment.AUTH_API_URL + "user";
    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    constructor(private http: HttpClient, 
                private messageService: MessageService,
                private router: Router) {
        this.userSubject = new BehaviorSubject<User | null>(
            JSON.parse(localStorage.getItem('user')!)
        );
        this.user = this.userSubject.asObservable();
    }

    /**
     * Cria um utilizador
     * @param user data view model
     * @returns 
     */
    signUp(name: string, email: string, telefone: string, nif: string | null, password: string, role: string) {

        if (name == "" || name == undefined || name == null ||
            email == "" || email == undefined || email == null ||
            telefone == "" || telefone == undefined || telefone == null ||
            password == "" || password == undefined || password == null ||
            role == "" || role == undefined || role == null) {

            this.log("Preencha todos os campos");
            return;
        }

        let user: UserModel = {
            name: name,
            email: email,
            telefone: telefone,
            password: password,
            estado: "aceito",
            role: role
        } as UserModel;

        if (nif !== null && nif !== "" && nif !== undefined) {
            user.nif = nif;
        }

        return this.http.post<string>(this.signUpUrl, user, this.httpOptions)
            .pipe(catchError(this.handleError<string>("signup")))
            .subscribe(data => {
                if (data != undefined) {
                    this.log(data);
                }
            });
    }

    approveOrReject(email: string, estado: string) {

        if (email == "" || email == undefined || email == null ||
            estado == "" || estado == undefined || estado == null) {

            this.log("Preencha todos os campos");
            return;
        }

        let user: UserModel = {
            email: email,
            estado: estado
        } as UserModel;

        return this.http.patch<string>(this.authUrl + "/approveOrReject", user, this.httpOptions)
            .pipe(catchError(this.handleError<string>("approveOrReject")))
            .subscribe(data => {
                if (data != undefined) {
                    this.log(data);
                }
            });
    }

    signupUtente(name: string, email: string, telefone: string, nif: string, password: string): void {

        if (nif == "" || nif == undefined || nif == null ||
            name == "" || name == undefined || name == null ||
            email == "" || email == undefined || email == null ||
            telefone == "" || telefone == undefined || telefone == null ||
            password == "" || password == undefined || password == null) {

            this.log("Preencha todos os campos");
            return;
        }

        let user = {
            name: name,
            email: email,
            telefone: telefone,
            password: password,
            nif: nif,
        };

        this.http.post<string>(this.authUrl + "/signupUtente", user, this.httpOptions)
            .pipe(catchError(this.handleError<string>("signup")))
            .subscribe({
                next: data => {
                    if (data != undefined) {
                        this.log(data);
                    }
                }
            });
    }

    /**
     * Retorna o valor do utilizador atual e o armazena na local storage
     * @param email string 
     * @param password string
     * @returns 
     */
    login(email: string, password: string) {
        if (email == "" || email == undefined || email == null ||
            password == "" || password == undefined || password == null) {

            this.log("É necessário email e password");
            return;
        }
        return this.http.post<any>(this.loginUrl, { email, password })
        .pipe(catchError(this.handleError<User>('Login')))
        .subscribe({
            next: data =>{
                if (data != undefined) {
                    console.log(data);
                    localStorage.setItem('user',JSON.stringify(data))
                    if(data.user.role == "admin"){
                        this.router.navigate(['/administrador']);
                    } else if (data.user.role == "utente") {
                        this.router.navigate(['/conta']);
                    } else if (data.user.role == "gestor de tarefas") {
                        this.router.navigate(['/gestaoPlaneamento']);
                    } else if (data.user.role == "gestor de campus") {
                        this.router.navigate(['/gestaoCampus']);
                    } else if (data.user.role == "gestor de frota") {
                        this.router.navigate(['/gestaoFrota']);
                    }else{
                        this.router.navigate(['/dashboard']);
                    }
                } else {
                    this.log("Erro de comunicação com o servidor de autenticação");
                }
            }
        });
    }
    
    public getUsername(): string {
        let username = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!).user.name : null;
        if(username == null){
            return "Sem Nome"
        }
        return username;
    }


    /**
     * Remove o utilizador da local storage
     * @returns 
     */
    logout() { 
        localStorage.removeItem('user'); 
        this.router.navigate(['/login']);
    }

    /**
     * Obtém o token do utilizador
     * @returns 
     */
    getToken(): string | null {
        return localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!).token : null;
    }

    listarUtilizadoresPendentes(): Observable<any> {
        return this.listarUtilizadoresPendentes2()
    }

    private listarUtilizadoresPendentes2(): Observable<any> {
        return this.http.get<UserModel[]>(this.authUrl + "/listarUtilizadoresPendentes", this.httpOptions)
            .pipe(
                catchError(this.handleError<UserModel[]>('Listar Utilizadores Pendentes')),
                map(data => data.map(item => item.email))
            );
    }

    public alterarDadosUtente(nome: string, tel: string, nif: string){
        

        let updateUserDataModel = {} as AlterarDadosUtente;

        if (nome != "" && nome != undefined && nome != null) {
            updateUserDataModel.name = nome;
        }

        if (tel != "" && tel != undefined && tel != null) {
            updateUserDataModel.telefone = tel;
        }

        if (nif != "" && nif != undefined && nif != null) {
            updateUserDataModel.nif = nif;
        }
        console.log(updateUserDataModel);
        this.http.put<AlterarDadosUtente>(this.authUrl, updateUserDataModel, this.httpOptions)
            .pipe(catchError(this.handleError<AlterarDadosUtente>("Alterar dados")))
            .subscribe({
                next: data => {
                    if (data != undefined) {
                        this.log("Dados alterados com sucesso!");
                    }
                }
            });
    }

    /**
     * Uma função para lidar com erros em requisições HTTP. Em caso de erro, desloga o utilizador e regista o erro na consola.
     * @param operation 
     * @param result 
     * @returns 
     */
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
      
            if(error.status === 440){
              this.log("Erro: Sessão expirada.");
              return of(result as T);
            }else if(error.status === 401){
              this.log("Erro: Não está autenticado.");
              return of(result as T);
            }else if(error.status === 403){
              this.log("Erro: Não tem permissões para aceder a este conteúdo.");
              return of(result as T);
            }else{
              console.log("HELLO");
              this.log(`${operation} falhou: ${error.error}`);
            }
      
            return of(result as T);
          };
    }

    /**
     *  Uma função para registar mensagens de erro na consola.
     * @param message 
     */
    public log(message: string) {
        this.messageService.add(`${message}`);
    }

    public deleteUtente() {
        this.http.delete<string>(this.authUrl + '/utente', this.httpOptions)
            .pipe(catchError(this.handleError<string>("Delete Utente")))
            .subscribe({
                next: data => {
                    if (data != undefined) {
                        localStorage.removeItem('user'); 
                        this.router.navigate(['/login']);
                        this.log("Delete Utente com sucesso!");
                    }
                }
            });
    }

}