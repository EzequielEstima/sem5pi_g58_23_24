import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignupComponent } from './signup.component'
import { SidebarAdministradorComponent } from '../sidebar/sidebar.component';
import { MessageComponent } from 'src/app/message/message.component';
import { AuthService } from 'src/serviceInfo/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SignupComponent', () => {

  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignupComponent,SidebarAdministradorComponent,MessageComponent],
      providers: [AuthService],
      imports: [HttpClientTestingModule]
    }).compileComponents();
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance
  });

  
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it ('deve chamar o método signUp do AuthService', () => {
    const name = 'Marco';
    const email = 'marco@isep.ipp.pt';
    const telefone = '916426727';
    component.nif = '910000000';
    const password = 'Password10@';
    const role = 'admin';
    let authService = TestBed.inject(AuthService);
    spyOn(component['userService'], 'signUp');
    component.add(name, email, telefone, password, role);

    expect(authService.signUp).toHaveBeenCalledWith(name, email, telefone, component.nif ,password, role);
  });

});
