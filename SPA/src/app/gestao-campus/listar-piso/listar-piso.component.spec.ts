import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MessageComponent } from '../../message/message.component'
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EdificioService } from 'src/serviceInfo/edificio.service';

import { of } from 'rxjs';


import { ListarPisoComponent } from './listar-piso.component';
import { PisoService } from 'src/serviceInfo/piso.service';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Piso } from 'src/dataModel/piso';

describe('ListarPisoComponent', () => {
  let component: ListarPisoComponent;
  let fixture: ComponentFixture<ListarPisoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListarPisoComponent,SidebarComponent,MessageComponent],
      imports: [HttpClientTestingModule,ReactiveFormsModule,HttpClientModule],
      providers: [EdificioService,PisoService],
    });
    fixture = TestBed.createComponent(ListarPisoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('[Listar Piso] deve chamar o método listarCodEdificios na inicialização do Componente (ngOnInit)', () => {
    const mockData = ['cod1', 'cod2'];
    spyOn(component['edificioService'], 'listarCodEdificios').and.returnValue(of(mockData));

    component.ngOnInit();

    expect(component.listaCodigos).toEqual(mockData);
  });

  it('[Listar Piso] deve chamar o método listarPisos do piso service método listarPisos', () => {
    const codigo = 'code1';
    const piso = {
      numeroPiso: '1',
      descricaoPiso: 'Description',
    } as unknown as Piso;
    let pisoService = TestBed.inject(PisoService);
    spyOn(component['pisoService'], 'listarPisos').and.returnValue(of([piso]));
    component.myForm.controls['codigo'].setValue('code1');
    component.listarPiso();

    expect(pisoService.listarPisos).toHaveBeenCalledWith(codigo);
  });
});
