import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarFrotaComponent } from './sidebar-frota.component';
import { AuthService } from 'src/serviceInfo/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SidebarFrotaComponent', () => {
  let component: SidebarFrotaComponent;
  let fixture: ComponentFixture<SidebarFrotaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SidebarFrotaComponent],
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });
    fixture = TestBed.createComponent(SidebarFrotaComponent);
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
