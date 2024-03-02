import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CriarEdificioComponent } from './criar-edificio.component';
import { MapaService } from '../../../serviceInfo/mapa.service';
import {SidebarComponent} from '../sidebar/sidebar.component';
import {MessageComponent} from '../../message/message.component';
import { EdificioService } from 'src/serviceInfo/edificio.service';

describe('CriarEdificioComponent', () => {
  let component: CriarEdificioComponent;
  let fixture: ComponentFixture<CriarEdificioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CriarEdificioComponent, SidebarComponent, MessageComponent],
      imports: [HttpClientTestingModule],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CriarEdificioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Método add chama o método criarEdificio do edificioService', () => {
    const cod = "cod";
    const dimensaoX = "1";
    const dimensaoY = "1";
    const nome = "nome";
    const descricao = "descricao";

    let edificioService = TestBed.inject(EdificioService);
    spyOn(component['edificioService'], 'criarEdificio');
    component.add(cod, dimensaoX, dimensaoY, nome, descricao);
    expect(edificioService.criarEdificio).toHaveBeenCalledWith(cod, dimensaoX, dimensaoY, nome, descricao);
  });
});
