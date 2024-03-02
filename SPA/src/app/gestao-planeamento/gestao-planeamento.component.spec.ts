import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestaoPlaneamentoComponent } from './gestao-planeamento.component';
import { SidebarGestaoPlaneamentoComponent } from './sidebar-gestao-planeamento/sidebar-gestao-planeamento.component';
import { AuthService } from 'src/serviceInfo/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('GestaoPlaneamentoComponent', () => {
  let component: GestaoPlaneamentoComponent;
  let fixture: ComponentFixture<GestaoPlaneamentoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GestaoPlaneamentoComponent,SidebarGestaoPlaneamentoComponent],
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });
    fixture = TestBed.createComponent(GestaoPlaneamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
