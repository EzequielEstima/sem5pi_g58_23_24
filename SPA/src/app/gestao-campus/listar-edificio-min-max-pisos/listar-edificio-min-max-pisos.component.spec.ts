import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MessageComponent } from '../../message/message.component'
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EdificioService } from 'src/serviceInfo/edificio.service';

import { of } from 'rxjs';

import { ListarEdificioMinMaxPisosComponent } from './listar-edificio-min-max-pisos.component';
import { Edificio } from 'src/dataModel/edificio';

describe('ListarEdificioMinMaxPisosComponent', () => {
  let component: ListarEdificioMinMaxPisosComponent;
  let fixture: ComponentFixture<ListarEdificioMinMaxPisosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListarEdificioMinMaxPisosComponent,SidebarComponent,MessageComponent],
      imports: [HttpClientTestingModule],
      providers: [EdificioService],
    });
    fixture = TestBed.createComponent(ListarEdificioMinMaxPisosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('listarEdificioMinMaxPisos chama o método listarEdificioMinMaxPisos do edificioService', () => {

    const edificio = {
      id: '1',
      nome: 'Cod1',
      descricao: '1',
      minPisos: '1',
      maxPisos: '1'
    } as unknown as Edificio;

    const listaEdificios = [edificio];

    let edificioService = TestBed.inject(EdificioService);

    spyOn(component['edificioService'], 'listarEdificioMinMaxPisos').and.returnValue(of(listaEdificios));

    component.listarEdificioMinMaxPisos('1','1');

    expect(edificioService.listarEdificioMinMaxPisos).toHaveBeenCalledWith(
      '1','1'
    );
    expect(component.listaEdificios).toEqual(listaEdificios);

  });

});
