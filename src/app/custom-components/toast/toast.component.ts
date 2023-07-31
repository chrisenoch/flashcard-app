import { DOCUMENT } from '@angular/common';
import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  Component,
  ContentChild,
  ElementRef,
  Inject,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent
  implements AfterViewChecked, AfterContentChecked, AfterContentInit
{
  constructor(
    @Inject(DOCUMENT) document: Document,
    private renderer2: Renderer2
  ) {}

  @ViewChild('toast') toastViewChild!: ElementRef;
  @ContentChild('accept') acceptContentChild: ElementRef | undefined;

  toastViewChildCopy!: ElementRef;
  count = 0;

  ngAfterContentInit(): void {
    if (this.acceptContentChild) {
      this.renderer2.listen(
        this.acceptContentChild.nativeElement,
        'click',
        (e: MouseEvent) => {
          console.log('dynamically inserted accept button was clicked');
        }
      );
    }
  }

  ngAfterContentChecked(): void {
    console.log('in aftercontentchecked');
  }

  //change this to AfterViewInit
  ngAfterViewChecked(): void {
    if (this.count === 0) {
      console.log(this.toastViewChild?.nativeElement);

      setTimeout(() => {
        setTimeout(() => {
          console.log('toastViewChildCopy ');
          console.log(this.toastViewChildCopy);
          document.body.appendChild(this.toastViewChildCopy?.nativeElement);
        }, 4000);
        // this.toastViewChild.nativeElement.parentElement.style.display = 'block';
        this.toastViewChildCopy = this.toastViewChild;
        this.toastViewChild?.nativeElement.parentElement.remove();
      }, 2000);
    }
    this.count++;
  }

  accept() {
    console.log('inside accept in toast');
  }

  deny() {
    console.log('inside deny in toast');
  }
}
