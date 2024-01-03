import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntrepotsComponent } from './entrepots.component';

describe('EntrepotsComponent', () => {
  let component: EntrepotsComponent;
  let fixture: ComponentFixture<EntrepotsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EntrepotsComponent]
    });
    fixture = TestBed.createComponent(EntrepotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
