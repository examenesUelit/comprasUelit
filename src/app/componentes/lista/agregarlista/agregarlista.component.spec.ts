import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarlistaComponent } from './agregarlista.component';

describe('AgregarlistaComponent', () => {
  let component: AgregarlistaComponent;
  let fixture: ComponentFixture<AgregarlistaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgregarlistaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarlistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
