import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { Note } from 'src/app/shared/note.model';
import { NotesService } from 'src/app/shared/notes.service';

@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss'],
  animations: [
    trigger('itemAnim',[
      //Entry Animation
      transition('void => *',[  //transition goes from void which means not exisiting in DOM to any state which is wildcard(*)
        //Initial State
        style({
          height: 0,
          opacity: 0,
          transform: 'scale(0.85)',
          'margin-bottom': 0,

          // we have to expand out the padding properties due to bug in firefox;
          paddingTop: 0,
          paddingBottom: 0,
          paddingRight: 0,
          paddingLeft: 0
          
        }),
        //we first want to animate the spcing
        animate('50ms',style({
          height: '*',
          'margin-bottom': '*',
          paddingTop: '*',
          paddingBottom: '*',
          paddingLeft: '*',
          paddingRight: '*'
        })),

        //animate the final state
        animate('68ms')
      ]),

      transition('* => void',[
        //first scale up
        animate(50, style({
          transform: 'scale(1.05)',
        })),

        //scale down back to normal size while beginning to fade out
        animate(50, style({
          transform: 'scale(1)',
          opacity: 0.75,
        })),

        //sclae down and fade out
        animate('120ms ease-out', style({
          transform: 'scale(0.68)',
          opacity: 0,
        })),

        //then animate the spacing
        animate('150ms ease-out', style({
          height: 0,
          paddingTop: 0,
          paddingBottom: 0,
          paddingRight: 0,
          paddingLeft: 0,
          'margin-bottom': 0,
        }))
      ])
    ]),

    trigger('listAnim',[
      transition('* => *',[
        query(':enter',[
          style({
            opacity: 0,
            height: 0
          }),

          stagger('100ms',[
            animate('0.2s ease')
          ])
        ],{optional:true})
      ])
    ])
  ]
})
export class NotesLIstComponent {

  notes: Note[] = new Array<Note>();

  constructor(private notesService: NotesService){}

  ngOnInit(){
    this.notes  = this.notesService.getAll();
  }

  deleteNote(id: number){
    this.notesService.delete(id);
  }
}
