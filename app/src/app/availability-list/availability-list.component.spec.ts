import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailabilityListComponent } from './availability-list.component';

describe('AvailabilityListComponent', () => {
  let component: AvailabilityListComponent;
  let fixture: ComponentFixture<AvailabilityListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvailabilityListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailabilityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
