import AlterarDadosUtente from "src/dataModel/alterarDadosUtente";
import { AlterarDadosUtenteComponent } from "./alterar-dados-utente.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SidebarContaComponent } from "../sidebar-conta/sidebar-conta.component";
import { MessageComponent } from "src/app/message/message.component";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { AuthService } from "src/serviceInfo/auth.service";

describe('AlterarDadosUtenteComponent', () => {
    let component: AlterarDadosUtenteComponent;
    let fixture: ComponentFixture<AlterarDadosUtenteComponent>;
  
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [AlterarDadosUtenteComponent, SidebarContaComponent, MessageComponent],
        imports: [HttpClientTestingModule,ReactiveFormsModule,],
        providers: [FormBuilder],
      });
      fixture = TestBed.createComponent(AlterarDadosUtenteComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('Método alterarDadosUtente chama o método alterarDadosUtente do authService', () => {
        const nome = "Nome1";
        const tel = "967888999";
        const nif = "123456789";

        let authService = TestBed.inject(AuthService);

        spyOn(authService, 'alterarDadosUtente');

        component.myForm.controls['nome'].setValue(nome);
        component.myForm.controls['tel'].setValue(tel);
        component.myForm.controls['nif'].setValue(nif);


        component.alterarDadosUtente();

        expect(authService.alterarDadosUtente).toHaveBeenCalledWith(
          nome,
          tel,
          nif
        );
      });
  });