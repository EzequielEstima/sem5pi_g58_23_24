import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarAdministradorComponent } from './sidebar.component';
import { AuthService } from 'src/serviceInfo/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SidebarAdministradorComponent', () => {
  let component: SidebarAdministradorComponent;
  let fixture: ComponentFixture<SidebarAdministradorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SidebarAdministradorComponent],
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });
    fixture = TestBed.createComponent(SidebarAdministradorComponent);
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
