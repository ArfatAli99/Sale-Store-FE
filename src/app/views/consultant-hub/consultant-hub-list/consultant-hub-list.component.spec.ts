import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultantHubComponent } from './consultant-hub-list.component';

describe('ConsultantHubComponent', () => {
  let component: ConsultantHubComponent;
  let fixture: ComponentFixture<ConsultantHubComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultantHubComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultantHubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
