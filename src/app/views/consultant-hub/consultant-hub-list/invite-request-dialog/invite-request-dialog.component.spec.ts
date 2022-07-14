import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteRequestDialogComponent } from './invite-request-dialog.component';

describe('InviteRequestDialogComponent', () => {
  let component: InviteRequestDialogComponent;
  let fixture: ComponentFixture<InviteRequestDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InviteRequestDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteRequestDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
