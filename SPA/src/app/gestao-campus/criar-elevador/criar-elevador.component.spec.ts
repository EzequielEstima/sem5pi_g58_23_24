import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CriarElevadorComponent } from './criar-elevador.component';
import { ElevadorService } from 'src/serviceInfo/elevador.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MessageComponent } from '../../message/message.component';
import { FormBuilder } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { EdificioService } from 'src/serviceInfo/edificio.service';
import { of } from 'rxjs';


describe('CriarElevadorComponent', () => {
  let component: CriarElevadorComponent;
  let fixture: ComponentFixture<CriarElevadorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CriarElevadorComponent, SidebarComponent, MessageComponent],
      imports: [HttpClientTestingModule,NgMultiSelectDropDownModule,ReactiveFormsModule],
      providers: [FormBuilder],
    });
    fixture = TestBed.createComponent(CriarElevadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Método criarElevador chama o método criarElevador do elevadorService', () => {
    const cod = 'cod';
    const pisosServidos = [1,2];
    const marca = '1';
    const modelo = '1';
    const numeroSerie = '1';
    const descricao = 'descricao';

    let elevadorService = TestBed.inject(ElevadorService);

    spyOn(elevadorService, 'criarElevador');

    component.myForm.controls['codigo'].setValue(cod);
    component.myForm.controls['pisosServidos'].setValue([{item_id :1, item_text :'1'},{item_id :2, item_text :'2'}]);
    component.myForm.controls['marca'].setValue(marca);
    component.myForm.controls['modelo'].setValue(modelo);
    component.myForm.controls['numeroSerie'].setValue(numeroSerie);
    component.myForm.controls['descricao'].setValue(descricao);

    component.criarElevador();

    expect(elevadorService.criarElevador).toHaveBeenCalledWith(
      cod,
      pisosServidos,
      marca,
      modelo,
      numeroSerie,
      descricao
    );
  });

  it('Método ngOnInit chama o método listarCodEdificios do edificioService', () => {
    const listaCodEdificios = ["cod1", "cod2"];
    let edificioService = TestBed.inject(EdificioService);
    spyOn(component['edificioService'], 'listarCodEdificios').and.returnValue(of(listaCodEdificios));
    component.ngOnInit();
    expect(edificioService.listarCodEdificios).toHaveBeenCalled();
    expect(component.listaCodEd).toEqual(listaCodEdificios);
  });
});
