import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesLIstComponent } from './notes-list.component';

describe('NotesLIstComponent', () => {
  let component: NotesLIstComponent;
  let fixture: ComponentFixture<NotesLIstComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotesLIstComponent]
    });
    fixture = TestBed.createComponent(NotesLIstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
