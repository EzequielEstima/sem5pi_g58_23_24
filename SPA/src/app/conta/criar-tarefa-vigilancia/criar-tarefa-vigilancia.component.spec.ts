import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { CriarTarefaVigilanciaComponent } from "./criar-tarefa-vigilancia.component";
import { SidebarContaComponent } from "../sidebar-conta/sidebar-conta.component";
import { MessageComponent } from "src/app/message/message.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TarefaService } from "src/serviceInfo/tarefa.service";
import { EdificioService } from "src/serviceInfo/edificio.service";
import { of } from "rxjs";

describe('CriarTarefaVigilancia', () => {
    let component: CriarTarefaVigilanciaComponent;
    let fixture: ComponentFixture<CriarTarefaVigilanciaComponent>;
  
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [CriarTarefaVigilanciaComponent, SidebarContaComponent, MessageComponent],
        imports: [HttpClientTestingModule,ReactiveFormsModule,],
        providers: [FormBuilder],
      });
      fixture = TestBed.createComponent(CriarTarefaVigilanciaComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('Método criarTarefaVigilancia chama o método criarTarefaVigilancia do tarefaService', () => {
        const nome = "Nome1";
        const numero = "123456789";
        const codigo = "A";
        const numeroPiso = 1; 
    
        let tarefaService = TestBed.inject(TarefaService);
    
        spyOn(tarefaService, 'criarTarefaVigilancia');
    
        component.myForm.controls['nomeVigilancia'].setValue(nome);
        component.myForm.controls['numeroVigilancia'].setValue(numero);
        component.myForm.controls['codigoEd'].setValue(codigo);
        component.myForm.controls['numeroPiso'].setValue(numeroPiso);

        component.criarTarefaVigilancia();
    
        expect(tarefaService.criarTarefaVigilancia).toHaveBeenCalledWith(
            nome,
            numero,
            codigo,
            numeroPiso
        );
      });

      it('Método ngOnInit chama o método listarCodEdificios do edificioService', () => {
        const listaCodEdificios = ["cod1", "cod2"];
        let edificioService = TestBed.inject(EdificioService);
        spyOn(component['edificioService'], 'listarCodEdificios').and.returnValue(of(listaCodEdificios));
        component.ngOnInit();
        expect(edificioService.listarCodEdificios).toHaveBeenCalled();
        expect(component.listaCodEdificios).toEqual(listaCodEdificios);
      });
  
  });