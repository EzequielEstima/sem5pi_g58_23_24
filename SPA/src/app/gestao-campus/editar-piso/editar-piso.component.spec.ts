import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PisoService } from '../../../serviceInfo/piso.service';
import { EdificioService } from 'src/serviceInfo/edificio.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MessageComponent } from '../../message/message.component'
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';


import { of } from 'rxjs';

import { EditarPisoComponent } from './editar-piso.component';

describe('EditarPisoComponent', () => {
  let component: EditarPisoComponent;
  let fixture: ComponentFixture<EditarPisoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditarPisoComponent,SidebarComponent,MessageComponent],
      providers: [PisoService, EdificioService],
      imports: [HttpClientTestingModule,ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(EditarPisoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    let edificioService = TestBed.inject(EdificioService);
    let pisoService = TestBed.inject(PisoService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve chamar o método listarCodEdificios na inicialização do Componente (ngOnInit)', () => {
    const mockData = ['cod1', 'cod2'];
    spyOn(component['edificioService'], 'listarCodEdificios').and.returnValue(of(mockData));

    component.ngOnInit();

    expect(component.listaCodigos).toEqual(mockData);
  });

  it('deve chamar o método editarPiso do piso service no método editarPiso', () => {
    const codigo = 'code1';
    const numeroPiso = '1';
    const descricaoPiso = 'Description';
    const novoNumeroPiso = '2';
  
    component.myForm.controls['codigo'].setValue('code1');
    component.myForm.controls['numeroPiso'].setValue('1');
    component.myForm.controls['novoNumeroPiso'].setValue('2');
    component.myForm.controls['descricaoPiso'].setValue('Description');

    let pisoService = TestBed.inject(PisoService);
    spyOn(component['pisoService'], 'editarPiso');
    component.editarPiso();

    expect(pisoService.editarPiso).toHaveBeenCalledWith(codigo, numeroPiso, novoNumeroPiso,descricaoPiso);
  });



});
