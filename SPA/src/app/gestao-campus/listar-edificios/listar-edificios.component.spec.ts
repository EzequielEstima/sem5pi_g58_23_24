import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ListarEdificiosComponent } from './listar-edificios.component';
import { MapaService } from '../../../serviceInfo/mapa.service';
import {SidebarComponent} from '../sidebar/sidebar.component';
import {MessageComponent} from '../../message/message.component';
import { EdificioService } from 'src/serviceInfo/edificio.service';
import { Edificio } from 'src/dataModel/edificio';
import { of } from 'rxjs';


describe('ListarEdificiosComponent', () => {
  let component: ListarEdificiosComponent;
  let fixture: ComponentFixture<ListarEdificiosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListarEdificiosComponent, SidebarComponent, MessageComponent],
      imports: [HttpClientTestingModule],
    });
    fixture = TestBed.createComponent(ListarEdificiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Método ngOnInit chama o método listarEdificios', ()=>{
    const listaEdificios = [{
      codigo: "cod",
      nome: "nome",
      descricao: "descricao",
      dimensaoX: 1,
      dimensaoY: 1,
    }] as Edificio[];
    let edificioService = TestBed.inject(EdificioService);
    spyOn(component['edificioService'], 'listarEdificios').and.returnValue(of(listaEdificios));
    component.ngOnInit();
    expect(edificioService.listarEdificios).toHaveBeenCalled();
    expect(component.listaEdificios).toEqual(listaEdificios);
  });
});
