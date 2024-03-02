import { TestBed } from '@angular/core/testing';

import { PlaneamentoService } from './planeamento.service';
import { HttpClientModule } from '@angular/common/http';

describe('PlaneamentoService', () => {
  let service: PlaneamentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule] // Add HttpClientModule to the imports array
    });
    service = TestBed.inject(PlaneamentoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
