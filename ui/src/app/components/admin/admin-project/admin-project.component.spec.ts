import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProjectComponent } from './admin-project.component';

describe('AdminProjectComponent', () => {
  let component: AdminProjectComponent;
  let fixture: ComponentFixture<AdminProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
