import { Component } from '@angular/core';
import { TipoRoboService } from 'src/serviceInfo/tipo-robo.service';

@Component({
  selector: 'app-apagar-tipo-robo',
  templateUrl: './apagar-tipo-robo.component.html',
  styleUrls: ['./apagar-tipo-robo.component.css']
})
export class ApagarTipoRoboComponent {
  constructor(private tipoRoboService: TipoRoboService) {}
  delete(id : string): void {
    this.tipoRoboService.apagarTipoRobo(id);
  }
}
