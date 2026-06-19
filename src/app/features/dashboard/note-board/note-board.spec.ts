import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteBoard } from './note-board';

describe('NoteBoard', () => {
  let component: NoteBoard;
  let fixture: ComponentFixture<NoteBoard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoteBoard],
    }).compileComponents();

    fixture = TestBed.createComponent(NoteBoard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
