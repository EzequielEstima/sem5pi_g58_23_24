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
import { ListarElevadorComponent } from './listar-elevador.component';
import { ListarElevador } from 'src/dataModel/listarElevador';


describe('ListarElevadorComponent', () => {
  let component: ListarElevadorComponent;
  let fixture: ComponentFixture<ListarElevadorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListarElevadorComponent, SidebarComponent, MessageComponent],
      imports: [HttpClientTestingModule,NgMultiSelectDropDownModule,ReactiveFormsModule],
      providers: [FormBuilder,ElevadorService],
    });
    fixture = TestBed.createComponent(ListarElevadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Método listarElevador chama o método listarElevador do elevadorService', () => {
    const cod = 'cod1';
    const elevador = 
      {    id: '1',
        marca: '1',
        modelo: '1',
        numeroSerie: '1',
        descricao: '1'
      } as unknown as ListarElevador

      const listaCodEdificios = [elevador];

    let elevadorService = TestBed.inject(ElevadorService);

    spyOn(component['elevadorService'], 'listarElevador').and.returnValue(of(elevador));

    component.myForm.controls['codigo'].setValue(cod);

    component.listarElevador();

    expect(elevadorService.listarElevador).toHaveBeenCalledWith(
      cod
    );
    expect(component.listaElevadores).toEqual(listaCodEdificios);
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
