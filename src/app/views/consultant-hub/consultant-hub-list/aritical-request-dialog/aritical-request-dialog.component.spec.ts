import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AriticalRequestDialogComponent } from './aritical-request-dialog.component';

describe('AriticalRequestDialogComponent', () => {
  let component: AriticalRequestDialogComponent;
  let fixture: ComponentFixture<AriticalRequestDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AriticalRequestDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AriticalRequestDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
