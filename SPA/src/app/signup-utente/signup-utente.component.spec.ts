import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageComponent } from '../message/message.component'
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { of } from 'rxjs';
import { AuthService } from 'src/serviceInfo/auth.service';
import { SignupUtenteComponent } from './signup-utente.component';

describe('SignupUtenteComponent', () => {
  let component: SignupUtenteComponent;
  let fixture: ComponentFixture<SignupUtenteComponent>;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignupUtenteComponent,MessageComponent],
      providers: [AuthService],
      imports: [HttpClientTestingModule]
    }).compileComponents();
    fixture = TestBed.createComponent(SignupUtenteComponent);
    component = fixture.componentInstance
  });

  

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve chamar o método signupUtente do authService método signupUtente', () => {
    
    const name = 'name';
    const email = 'email@isep.ipp.pt';
    const password = 'Password10@';
    const nif = '123456789';
    const telefone = '123456789';

    let authService = TestBed.inject(AuthService);
    spyOn(document, 'getElementById').and.returnValue({ checked: true } as HTMLInputElement);

    spyOn(component['authService'], 'signupUtente');
    component.signupUtente(name,email,telefone,nif,password);

    expect(authService.signupUtente).toHaveBeenCalledWith(name,email,telefone,nif,password);
  });

});
