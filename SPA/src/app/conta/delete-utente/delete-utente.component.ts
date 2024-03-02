import { Component } from '@angular/core';
import { AuthService } from 'src/serviceInfo/auth.service';
import { MessageService } from 'src/serviceInfo/message.service';

@Component({
  selector: 'app-delete-utente',
  templateUrl: './delete-utente.component.html',
  styleUrls: ['./delete-utente.component.css']
})
export class DeleteUtenteComponent {

  constructor(private authService: AuthService) { }

  public deleteUtente(deleteString: string) {
    if (deleteString == "delete") {
      this.authService.deleteUtente();
    }else{
      this.authService.log("Deve escrever 'delete' para confirmar a eliminação da conta.")
    }
  }

}
