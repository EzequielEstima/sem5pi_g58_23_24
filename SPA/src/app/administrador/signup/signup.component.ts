import { Component } from '@angular/core';
import { AuthService } from 'src/serviceInfo/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  constructor(private userService: AuthService) {}

  selectedRole: string | null = null; 
  nif : string | null = null;

  changeNif(nif: string): void {
    this.nif = nif;
  }


  add(name:string, email:string, telefone:string, password:string, role:string): void {
    console.log(name, email, telefone, this.nif, password, role);
    this.userService.signUp(name, email, telefone, this.nif, password, role);
  }

}
