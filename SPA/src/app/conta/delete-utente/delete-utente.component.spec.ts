import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageComponent } from '../../message/message.component'
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { of } from 'rxjs';
import { AuthService } from 'src/serviceInfo/auth.service';
import { DeleteUtenteComponent } from './delete-utente.component';
import { SidebarContaComponent } from '../sidebar-conta/sidebar-conta.component';

describe('deleteUtenteComponent', () => {
  let component: DeleteUtenteComponent;
  let fixture: ComponentFixture<DeleteUtenteComponent>;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteUtenteComponent,MessageComponent,SidebarContaComponent],
      providers: [AuthService],
      imports: [HttpClientTestingModule]
    }).compileComponents();
    fixture = TestBed.createComponent(DeleteUtenteComponent);
    component = fixture.componentInstance
  });

  

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve chamar o método deleteUtente do authService no método deleteUtente', () => {
   
    let authService = TestBed.inject(AuthService);

    spyOn(component['authService'], 'deleteUtente');
    component.deleteUtente("delete");

    expect(authService.deleteUtente).toHaveBeenCalled();
  });

});
