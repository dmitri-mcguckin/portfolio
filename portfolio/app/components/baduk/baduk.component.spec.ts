import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BadukComponent } from './baduk.component';

describe('BadukComponent', () => {
  let component: BadukComponent;
  let fixture: ComponentFixture<BadukComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BadukComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BadukComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
