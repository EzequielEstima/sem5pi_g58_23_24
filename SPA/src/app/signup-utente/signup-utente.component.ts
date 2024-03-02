import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/serviceInfo/auth.service';

@Component({
  selector: 'app-signup-utente',
  templateUrl: './signup-utente.component.html',
  styleUrls: ['./signup-utente.component.css']
})
export class SignupUtenteComponent {
  
  constructor(private authService: AuthService) {  }

  signupUtente(name: string, email: string, telefone: string, nif:string, password: string): void {
    const checkbox = document.getElementById("checkbox") as HTMLInputElement;

    if (checkbox != null) {
      if (checkbox.checked) {
        this.authService.signupUtente(name, email, telefone, nif, password);
      } else {
        this.authService.log("Deve aceitar os termos e condições.")
      }
    }
  }
}
