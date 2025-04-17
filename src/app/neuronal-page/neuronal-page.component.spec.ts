import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeuronalPageComponent } from './neuronal-page.component';

describe('NeuronalPageComponent', () => {
  let component: NeuronalPageComponent;
  let fixture: ComponentFixture<NeuronalPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NeuronalPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NeuronalPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
