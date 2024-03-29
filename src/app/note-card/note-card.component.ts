import { Component, ElementRef, EventEmitter, Input, Output, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-note-card',
  templateUrl: './note-card.component.html',
  styleUrls: ['./note-card.component.scss']
})
export class NoteCardComponent {

  @Input() title!: string;
  @Input() body!: string;
  @Input() link!: number;

  @Output('delete') deleteEvent: EventEmitter<void> = new EventEmitter<void>;

  @ViewChild('truncator') truncator!: ElementRef<HTMLElement>;
  @ViewChild('bodyText') bodyText!: ElementRef<HTMLElement>;

  constructor(private renderer: Renderer2){}

  ngAfterViewInit() {
    this.checkForTextOverflow();
  }

  checkForTextOverflow(){
    //workout if there is text overflow, if not then hide the truncator
    let style = window.getComputedStyle(this.bodyText.nativeElement, null);
    let viewableHeight = parseInt(style.getPropertyValue("height"), 10);

    if(this.bodyText.nativeElement.scrollHeight > viewableHeight){
      //if there is no text overflow, show the fade out truncator
      this.renderer.setStyle(this.truncator.nativeElement,'display','block');
    }else{
      //else (there is text overflow, hide the truncator)
      this.renderer.setStyle(this.truncator.nativeElement,'display','none');
    }
  }

  onXButtonClick(){
    this.deleteEvent.emit();
  }

}
