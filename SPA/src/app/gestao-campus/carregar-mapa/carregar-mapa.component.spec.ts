import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CarregarMapaComponent } from './carregar-mapa.component';
import {SidebarComponent} from '../sidebar/sidebar.component';
import {MessageComponent} from '../../message/message.component';

describe('CarregarMapaComponent', () => {
  let component: CarregarMapaComponent;
  let fixture: ComponentFixture<CarregarMapaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CarregarMapaComponent, SidebarComponent, MessageComponent],
      imports: [HttpClientTestingModule],
    });
    fixture = TestBed.createComponent(CarregarMapaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});