import { Component, OnInit  } from '@angular/core';
import { Edificio } from 'src/dataModel/edificio';
import { EdificioService } from 'src/serviceInfo/edificio.service';

@Component({
  selector: 'app-listar-edificios',
  templateUrl: './listar-edificios.component.html',
  styleUrls: ['./listar-edificios.component.css']
})
export class ListarEdificiosComponent implements OnInit{

  constructor(private edificioService: EdificioService) { }

  listaEdificios: Edificio[] = [];

  ngOnInit(): void {  
    this.edificioService.listarEdificios().subscribe(
      data => {
        this.listaEdificios = data;
      },
    );
  }
}
