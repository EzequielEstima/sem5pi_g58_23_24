import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DispositivoService } from 'src/serviceInfo/dispositivo.service';

@Component({
  selector: 'app-inibir-dispositivo',
  templateUrl: './inibir-dispositivo.component.html',
  styleUrls: ['./inibir-dispositivo.component.css']
})
export class InibirDispositivoComponent {
  constructor(private dispositivoService: DispositivoService) {}

  listaCod: string[] = [];

  ngOnInit(): void {  
    this.dispositivoService.listarCod().subscribe({
      next: data => {
        this.listaCod = data;
      }
    });  }

  add(codigo: string): void {
    this.dispositivoService.inibirDispositivo(codigo);
  }
}
