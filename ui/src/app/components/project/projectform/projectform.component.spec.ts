import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectformComponent } from './projectform.component';

describe('ProjectformComponent', () => {
  let component: ProjectformComponent;
  let fixture: ComponentFixture<ProjectformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
