import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/serviceInfo/auth.service';

@Component({
  selector: 'app-alterar-dados-utente',
  templateUrl: './alterar-dados-utente.component.html',
  styleUrls: ['./alterar-dados-utente.component.css']
})
export class AlterarDadosUtenteComponent {

  myForm!: FormGroup;

  constructor(private fb: FormBuilder,
              private authService: AuthService){
               
  }

  ngOnInit() : void {
    this.myForm = this.fb.group({
      nome: ['', Validators.required],
      tel: ['', Validators.required],
      nif: ['', Validators.required],
    });
  }

  alterarDadosUtente(): void {
    const nome = this.myForm.get('nome')?.value;
    const tel = this.myForm.get('tel')?.value;
    const nif = this.myForm.get('nif')?.value;

    this.authService.alterarDadosUtente(nome, tel, nif);
  }
}
