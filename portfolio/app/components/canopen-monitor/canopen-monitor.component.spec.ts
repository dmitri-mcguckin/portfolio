import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanopenMonitorComponent } from './canopen-monitor.component';

describe('CanopenMonitorComponent', () => {
  let component: CanopenMonitorComponent;
  let fixture: ComponentFixture<CanopenMonitorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CanopenMonitorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanopenMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
