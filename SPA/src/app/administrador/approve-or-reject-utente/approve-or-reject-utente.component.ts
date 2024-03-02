import { Component } from '@angular/core';
import { AuthService } from 'src/serviceInfo/auth.service';

@Component({
  selector: 'app-approve-or-reject-utente',
  templateUrl: './approve-or-reject-utente.component.html',
  styleUrls: ['./approve-or-reject-utente.component.css']
})
export class ApproveOrRejectUtenteComponent {

  constructor(private userService: AuthService) { }

  listaDeUtilizadores: any[] = [];;

  ngOnInit() {
    this.listarUtilizadoresPendentes();
  }

  listarUtilizadoresPendentes() {
    this.userService.listarUtilizadoresPendentes().subscribe({
      next: data => {
        this.listaDeUtilizadores = data;
      }
    });
  }


  add(email: string, estado: string): void {
    this.userService.approveOrReject(email, estado);
  }
}
