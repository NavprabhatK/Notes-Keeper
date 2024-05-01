import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, ViewChild } from '@angular/core';
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

  filteredNotes: Note[] = new Array<Note>();
  
  @ViewChild('filterInput')
  filterInputEleRef!: ElementRef<HTMLInputElement>;

  constructor(private notesService: NotesService){}

  ngOnInit(){
    this.notes  = this.notesService.getAll();
    //this.filteredNotes = this.notesService.getAll();
    this.filter('')
  }

  deleteNote(note: Note){
    let id = this.notesService.getId(note);
    this.notesService.delete(id);
    this.filter(this.filterInputEleRef.nativeElement.value);
  }

  filter(query: string){
    query = query.toLowerCase().trim();
    let AllResults : Note[] = new Array<Note>();
    let terms: string[] = query.split(' '); //split on spaces
    //remove duplicates search terms
    terms = this.removeDuplicates(terms);
    //compile all relevant results into All results array
    terms.forEach(term => {
      let results = this.relevantNotes(term);
      //append these results to all list array.
      AllResults = [...AllResults, ...results] //it will merge the 2 array
    })

    //allResults contains duplicates, becuase same results can be result for same search term, so we need to remove it
    let uniqueResult = this.removeDuplicates(AllResults);
    this.filteredNotes = uniqueResult;
    this.sortRelevancy(AllResults);
  }

  removeDuplicates(arr: Array<any>): Array<any>{
    let uniqueResult: Set<any> = new Set<any>();
    //loop through the input array and add it in set
    arr.forEach(e => uniqueResult.add(e));
    return Array.from(uniqueResult);
  }

  relevantNotes(query: string): Array<Note> {
    query = query.toLowerCase().trim();
    let relevantNotes = this.notes.filter(note => {
      if(note.title && note.title.toLowerCase().includes(query)){
        return true;
      }
      if(note.body && note.body.toLowerCase().includes(query)){
        return true;
      }
      return false;
    })
    return relevantNotes;
  }

  sortRelevancy(searchResults: Note[]){
    // this method will calculate the relvancy of a note based on the number of times the it appears in the search results
    let noteCountObj : Map<number, number> = new Map<number, number>(); // format - key:value => NoteId:Number (note objectid: count)

    searchResults.forEach(note => {
      let NoteId = this.notesService.getId(note); 

      if(noteCountObj.get(NoteId)){
        let orgninalVal= noteCountObj.get(NoteId);
        let value : number;
        if(orgninalVal === undefined){
          value = 1;
        }else{
        value = orgninalVal + 1;
        }
        noteCountObj.set(NoteId,value)
      }else{
        let value =1;
        noteCountObj.set(NoteId,value)
      }

      this.filteredNotes = this.filteredNotes.sort((a:Note, b:Note) =>{
        let aId = this.notesService.getId(a);
        let bId = this.notesService.getId(b);

        let aCount = noteCountObj.get(aId);
        let bCount = noteCountObj.get(bId);
        return bCount! - aCount!;
      })
    })
  }

  generateNoteURL(note: Note){
    let noteId = this.notesService.getId(note);
    return noteId;
  }
}
