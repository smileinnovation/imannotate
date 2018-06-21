import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageAnnotatorComponent } from './image-annotator.component';

describe('ImageAnnotatorComponent', () => {
  let component: ImageAnnotatorComponent;
  let fixture: ComponentFixture<ImageAnnotatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageAnnotatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageAnnotatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
