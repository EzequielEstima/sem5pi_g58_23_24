import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ElevadorService } from 'src/serviceInfo/elevador.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MessageComponent } from '../../message/message.component';
import { FormBuilder } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { EdificioService } from 'src/serviceInfo/edificio.service';
import { of } from 'rxjs';
import { ListarElevador } from 'src/dataModel/listarElevador';
import { ListarPassagemPorEdificiosComponent } from './listar-passagem-por-edificios.component';
import { ListarPassagem } from 'src/dataModel/listarPassagem';
import { PassagemService } from 'src/serviceInfo/passagem.service';


describe('ListarPassagensPorEdificioComponent', () => {
  let component: ListarPassagemPorEdificiosComponent;
  let fixture: ComponentFixture<ListarPassagemPorEdificiosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListarPassagemPorEdificiosComponent, SidebarComponent, MessageComponent],
      imports: [HttpClientTestingModule,NgMultiSelectDropDownModule,ReactiveFormsModule],
      providers: [FormBuilder,ElevadorService],
    });
    fixture = TestBed.createComponent(ListarPassagemPorEdificiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Método listarPassagens chama o método listarPassagensPorEdificio do passagemService', () => {
    const cod1 = 'cod1';
    const cod2 = 'cod2';
    const passagem = 
      {       id: 1,
        numeroPisoA: 1,
        idPisoA: 1,
        numeroPisoB: 2,
        idPisoB: 2,
      } as unknown as ListarPassagem

      const listaPassagens = [passagem];

    let passagemService = TestBed.inject(PassagemService);

    spyOn(component['passagemService'], 'listarPassagensPorEdificios').and.returnValue(of([passagem]));

    component.myForm.controls['cod1'].setValue(cod1);
    component.myForm.controls['cod2'].setValue(cod2);

    component.listarPassagensPorEdificios();

    expect(passagemService.listarPassagensPorEdificios).toHaveBeenCalledWith(
      cod1,
      cod2
    );
    expect(component.listaPassagens).toEqual(listaPassagens);
  });

  it('Método ngOnInit chama o método listarCodEdificios do edificioService', () => {
    const listaCodEdificios = ["cod1", "cod2"];
    let edificioService = TestBed.inject(EdificioService);
    spyOn(component['edificioService'], 'listarCodEdificios').and.returnValue(of(listaCodEdificios));
    component.ngOnInit();
    expect(edificioService.listarCodEdificios).toHaveBeenCalled();
    expect(component.listaCodigosEd).toEqual(listaCodEdificios);
  });
});
