import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EditarEdificioComponent } from './editar-edificio.component';
import { MapaService } from '../../../serviceInfo/mapa.service';
import {SidebarComponent} from '../sidebar/sidebar.component';
import {MessageComponent} from '../../message/message.component';
import { EdificioService } from 'src/serviceInfo/edificio.service';
import { of } from 'rxjs';


describe('EditarEdificioComponent', () => {
  let component: EditarEdificioComponent;
  let fixture: ComponentFixture<EditarEdificioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditarEdificioComponent, SidebarComponent, MessageComponent],
      imports: [HttpClientTestingModule],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditarEdificioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Método edit chama o método editarEdificio do edificioService', () => {
    const cod = "cod";
    const nome = "nome";
    const descricao = "descricao";

    let edificioService = TestBed.inject(EdificioService);
    spyOn(component['edificioService'], 'editarEdificio');
    component.edit(cod, nome, descricao);
    expect(edificioService.editarEdificio).toHaveBeenCalledWith(cod, nome, descricao);
  });

  it('Método ngOnInit chama o método listarCodEdificios do edificioService', () => {
    const listaCodEdificios = ["cod1", "cod2"];
    let edificioService = TestBed.inject(EdificioService);
    spyOn(component['edificioService'], 'listarCodEdificios').and.returnValue(of(listaCodEdificios));
    component.ngOnInit();
    expect(edificioService.listarCodEdificios).toHaveBeenCalled();
    expect(component.listaCodigos).toEqual(listaCodEdificios);
  });
});
