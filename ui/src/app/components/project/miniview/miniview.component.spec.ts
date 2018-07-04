import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniviewComponent } from './miniview.component';

describe('MiniviewComponent', () => {
  let component: MiniviewComponent;
  let fixture: ComponentFixture<MiniviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MiniviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiniviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
