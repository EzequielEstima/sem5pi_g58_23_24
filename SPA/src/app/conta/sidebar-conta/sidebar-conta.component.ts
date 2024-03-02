import { Component } from '@angular/core';
import { AuthService } from 'src/serviceInfo/auth.service';

@Component({
  selector: 'app-sidebar-conta',
  templateUrl: './sidebar-conta.component.html',
  styleUrls: ['./sidebar-conta.component.css']
})
export class SidebarContaComponent {
  
    constructor(private authService: AuthService) { }

    logout() {
      this.authService.logout();
    }
}
