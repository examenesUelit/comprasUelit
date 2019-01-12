import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarprecioComponent } from './editarprecio.component';

describe('EditarprecioComponent', () => {
  let component: EditarprecioComponent;
  let fixture: ComponentFixture<EditarprecioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarprecioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarprecioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
