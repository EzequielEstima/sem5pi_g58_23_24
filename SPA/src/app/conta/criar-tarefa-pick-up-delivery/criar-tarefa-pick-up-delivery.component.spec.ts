import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CriarTarefaPickUpDeliveryComponent } from "./criar-tarefa-pick-up-delivery.component";
import { SidebarContaComponent } from "../sidebar-conta/sidebar-conta.component";
import { MessageComponent } from "src/app/message/message.component";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TarefaService } from "src/serviceInfo/tarefa.service";

describe('CriarTarefaPickUpDeliveryComponent', () => {
    let component: CriarTarefaPickUpDeliveryComponent;
    let fixture: ComponentFixture<CriarTarefaPickUpDeliveryComponent>;
  
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [CriarTarefaPickUpDeliveryComponent, SidebarContaComponent, MessageComponent],
        imports: [HttpClientTestingModule,ReactiveFormsModule,],
        providers: [FormBuilder],
      });
      fixture = TestBed.createComponent(CriarTarefaPickUpDeliveryComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('Método criarTarefaPickUpDelivery chama o método criarTarefaPickUpDelivery do tarefaService', () => {
        const codigo = "12345";
        const nomeP = "Nome1";
        const numeroP = "123456789";
        const nomeD = "Nome2";
        const numeroD = "987654321";
        const desc = "descricao";
        const salaI = "A202";
        const salaF = "A203";

        let tarefaService = TestBed.inject(TarefaService);

        spyOn(tarefaService, 'criarTarefaPickUpDelivery');

        component.myForm.controls['codConf'].setValue(codigo);
        component.myForm.controls['desc'].setValue(desc);
        component.myForm.controls['nomePickUp'].setValue(nomeP);
        component.myForm.controls['numeroPickUp'].setValue(numeroP);
        component.myForm.controls['nomeDelivery'].setValue(nomeD);        
        component.myForm.controls['numeroDelivery'].setValue(numeroD);
        component.myForm.controls['salaInicial'].setValue(salaI);
        component.myForm.controls['salaFinal'].setValue(salaF);

        component.criarTarefaPickUpDelivery();

        expect(tarefaService.criarTarefaPickUpDelivery).toHaveBeenCalledWith(
            codigo,
            desc,
            nomeP,
            numeroP,
            nomeD,
            numeroD,
            salaI,
            salaF
        );
      });
  });