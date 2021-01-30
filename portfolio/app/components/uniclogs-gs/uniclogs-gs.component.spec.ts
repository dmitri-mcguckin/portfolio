import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UniclogsGsComponent } from './uniclogs-gs.component';

describe('UniclogsGsComponent', () => {
  let component: UniclogsGsComponent;
  let fixture: ComponentFixture<UniclogsGsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UniclogsGsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UniclogsGsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
