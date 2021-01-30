import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionServerComponent } from './mission-server.component';

describe('MissionServerComponent', () => {
  let component: MissionServerComponent;
  let fixture: ComponentFixture<MissionServerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MissionServerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MissionServerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
