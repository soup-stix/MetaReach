import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareableComponent } from './shareable.component';

describe('ShareableComponent', () => {
  let component: ShareableComponent;
  let fixture: ComponentFixture<ShareableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShareableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShareableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
