import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallelistaComponent } from './detallelista.component';

describe('DetallelistaComponent', () => {
  let component: DetallelistaComponent;
  let fixture: ComponentFixture<DetallelistaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetallelistaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallelistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
