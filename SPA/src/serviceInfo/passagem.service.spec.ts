import { TestBed } from '@angular/core/testing';
import { PassagemService } from './passagem.service';
import { HttpClient } from '@angular/common/http';
import { devEnvironment } from 'src/environments/environment.development';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ListarPassagem } from 'src/dataModel/listarPassagem';
import { of } from 'rxjs';



describe('PassagemService', () => {
  let service: PassagemService;
  let httpClient: HttpClient;

  const elevadorUrl = devEnvironment.MDRI_API_URL + 'passagem';  
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule]
    });
    service = TestBed.inject(PassagemService);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Método listarPassagensPorEdificio chama o método get do HttpClient', () => {
    const testData: ListarPassagem = {
      id: 1,
      numeroPisoA: 1,
      idPisoA: 1,
      numeroPisoB: 2,
      idPisoB: 2
    };

    const getSpy = spyOn(httpClient, 'get').and.returnValue(of([testData]));

    service.listarPassagensPorEdificios('A','B');
    expect(getSpy).toHaveBeenCalled();
  });
});
