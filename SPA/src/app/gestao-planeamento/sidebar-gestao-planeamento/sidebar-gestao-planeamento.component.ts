import { Component } from '@angular/core';
import { AuthService } from 'src/serviceInfo/auth.service';

@Component({
  selector: 'app-sidebar-gestao-planeamento',
  templateUrl: './sidebar-gestao-planeamento.component.html',
  styleUrls: ['./sidebar-gestao-planeamento.component.css']
})
export class SidebarGestaoPlaneamentoComponent {
  constructor(private authService: AuthService) { }

  logout() {
    this.authService.logout();
  }
}
