import { Component } from '@angular/core';
import { AuthService } from 'src/serviceInfo/auth.service';

@Component({
  selector: 'app-sidebarGestaoCampus',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  constructor(private authService: AuthService) { }

  logout() {
    this.authService.logout();
  }
}
