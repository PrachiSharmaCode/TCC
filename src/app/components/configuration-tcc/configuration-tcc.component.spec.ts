import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationTCCComponent } from './configuration-tcc.component';

describe('ConfigurationTCCComponent', () => {
  let component: ConfigurationTCCComponent;
  let fixture: ComponentFixture<ConfigurationTCCComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurationTCCComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationTCCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
