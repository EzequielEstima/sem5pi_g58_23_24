import { Component } from '@angular/core';
import { EdificioService } from 'src/serviceInfo/edificio.service';

@Component({
  selector: 'app-apagar-edificio',
  templateUrl: './apagar-edificio.component.html',
  styleUrls: ['./apagar-edificio.component.css']
})
export class ApagarEdificioComponent {
  constructor(private edificioService: EdificioService) {}
  delete(codigo : string): void {
    this.edificioService.apagarEdificio(codigo);
  }
}
