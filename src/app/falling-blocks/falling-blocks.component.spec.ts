import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FallingBlocksComponent } from './falling-blocks.component';

describe('FallingBlocksComponent', () => {
  let component: FallingBlocksComponent;
  let fixture: ComponentFixture<FallingBlocksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FallingBlocksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FallingBlocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
