import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApproveOrRejectUtenteComponent } from './approve-or-reject-utente.component';
import { AuthService } from 'src/serviceInfo/auth.service';
import { of } from 'rxjs';
import { SidebarAdministradorComponent } from '../sidebar/sidebar.component';
import { MessageComponent } from 'src/app/message/message.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

describe('ApproveOrRejectUtenteComponent', () => {
    let component: ApproveOrRejectUtenteComponent;
    let fixture: ComponentFixture<ApproveOrRejectUtenteComponent>;
    let userService: jasmine.SpyObj<AuthService>;
    let emailListMock = ["user@isep.ipp.pt"]

    beforeEach(async () => {
    
        userService = jasmine.createSpyObj('AuthService', {
            listarUtilizadoresPendentes: of( emailListMock ), // Retorna um Observable simulado
            approveOrReject: null
          });
        TestBed.configureTestingModule({
            declarations: [ApproveOrRejectUtenteComponent, SidebarAdministradorComponent, MessageComponent],
            providers: [{ provide: AuthService, useValue: userService }],
            imports: [HttpClientTestingModule, HttpClientModule, BrowserModule, FormsModule],
        }).compileComponents();
        fixture = TestBed.createComponent(ApproveOrRejectUtenteComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    })

    it('should create', () => {
        expect(component).toBeTruthy();
        expect(userService).toBeTruthy();
    });

    it('should call listarUtilizadoresPendentes on ngOnInit', () => {
        spyOn(component, 'listarUtilizadoresPendentes');
        component.ngOnInit();
        expect(component.listarUtilizadoresPendentes).toHaveBeenCalled();
    });

    it('should update listaDeUtilizadores with data from listarUtilizadoresPendentes', () => {
        component.listarUtilizadoresPendentes();
        expect(component.listaDeUtilizadores).toEqual(["user@isep.ipp.pt"]);
    });

    it('should call userService.approveOrReject with correct parameters', () => {
        const email = 'user@example.isep.ipp.pt';
        const estado = 'aceito';
        component.add(email, estado);
        expect(userService.approveOrReject).toHaveBeenCalledWith(email, estado);
    });

});