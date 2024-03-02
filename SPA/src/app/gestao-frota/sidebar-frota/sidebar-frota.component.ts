import { Component } from '@angular/core';
import { AuthService } from 'src/serviceInfo/auth.service';

@Component({
  selector: 'app-sidebar-frota',
  templateUrl: './sidebar-frota.component.html',
  styleUrls: ['./sidebar-frota.component.css']
})
export class SidebarFrotaComponent {

  constructor(private authService: AuthService) { }

  logout() {
    this.authService.logout();
  }
}
