import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestaoCampusComponent } from './gestao-campus.component';
import { AppRoutingModule } from '../app-routing.module';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AuthService } from 'src/serviceInfo/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('GestaoCampusComponent', () => {
  let component: GestaoCampusComponent;
  let fixture: ComponentFixture<GestaoCampusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        GestaoCampusComponent,
        SidebarComponent // Add this if you're testing it alongside GestaoCampusComponent
      ],
      imports: [HttpClientTestingModule],
      providers: [AuthService],

      // Other configurations...
    }).compileComponents();
    fixture = TestBed.createComponent(GestaoCampusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
