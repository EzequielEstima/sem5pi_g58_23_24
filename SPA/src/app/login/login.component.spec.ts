import { ComponentFixture, TestBed } from "@angular/core/testing";
import { LoginComponent } from "./login.component";
import { MessageComponent } from "../message/message.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { AuthService } from "src/serviceInfo/auth.service";

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent, MessageComponent],
      imports: [HttpClientTestingModule,ReactiveFormsModule],
      providers: [],
    });
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Método login chama o método login do authService', () => {
    const email = 'email@email.pt';
    const password = 'password';

    let authService = TestBed.inject(AuthService);

    spyOn(authService, 'login');

    component.login(email, password);

    expect(authService.login).toHaveBeenCalledWith(
      email,
      password
    );
  });
});
