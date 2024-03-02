import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarGestaoPlaneamentoComponent } from './sidebar-gestao-planeamento.component';
import { AuthService } from 'src/serviceInfo/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SidebarGestaoPlaneamentoComponent', () => {
  let component: SidebarGestaoPlaneamentoComponent;
  let fixture: ComponentFixture<SidebarGestaoPlaneamentoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SidebarGestaoPlaneamentoComponent],
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });
    fixture = TestBed.createComponent(SidebarGestaoPlaneamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve chamar o método logout do Authservice', () => {
    spyOn(component['authService'], 'logout');

    let authService = TestBed.inject(AuthService);

    component.logout();


    expect(authService.logout).toHaveBeenCalled();
  });
});
