import { Component, OnInit } from '@angular/core';
import { Dispositivo } from 'src/dataModel/dispositivo';
import { DispositivoService } from 'src/serviceInfo/dispositivo.service';

@Component({
  selector: 'app-listar-dispositivos-frota',
  templateUrl: './listar-dispositivos-frota.component.html',
  styleUrls: ['./listar-dispositivos-frota.component.css']
})
export class ListarDispositivosFrotaComponent implements OnInit{
  
  listaDispositivos: Dispositivo[] = [];
  
  constructor(private dispositivoService: DispositivoService) { }
  
  ngOnInit(): void {
    this.dispositivoService.listarDispositivosFrota().subscribe({
      next: data => {
        this.listaDispositivos = data;
      }
    });
  }
}
