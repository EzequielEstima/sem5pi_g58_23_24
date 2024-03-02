import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarContaComponent } from './sidebar-conta.component';
import { AuthService } from 'src/serviceInfo/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SidebarContaComponent', () => {
  let component: SidebarContaComponent;
  let fixture: ComponentFixture<SidebarContaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SidebarContaComponent],
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });
    fixture = TestBed.createComponent(SidebarContaComponent);
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
