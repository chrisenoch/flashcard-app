import { DOCUMENT } from '@angular/common';
import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent implements AfterViewChecked {
  constructor(@Inject(DOCUMENT) document: Document) {}

  @ViewChild('toast') toastViewChild!: ElementRef | undefined;

  toastViewChildCopy!: ElementRef | undefined;
  count = 0;

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
