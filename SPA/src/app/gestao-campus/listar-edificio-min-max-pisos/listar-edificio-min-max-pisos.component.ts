import { Component } from '@angular/core';
import { Edificio } from 'src/dataModel/edificio';
import { EdificioService } from 'src/serviceInfo/edificio.service';

@Component({
  selector: 'app-listar-edificio-min-max-pisos',
  templateUrl: './listar-edificio-min-max-pisos.component.html',
  styleUrls: ['./listar-edificio-min-max-pisos.component.css']
})
export class ListarEdificioMinMaxPisosComponent {

  listaEdificios: Edificio[] = [];

  constructor(
    private edificioService: EdificioService,
    ) { }

  
  ngOnInit(): void {  
  }

  listarEdificioMinMaxPisos(minPisos: string, maxPisos: string): void {
    this.edificioService.listarEdificioMinMaxPisos(minPisos, maxPisos).subscribe(
      data => {
        this.listaEdificios = data;
      },
    );
  }
}
