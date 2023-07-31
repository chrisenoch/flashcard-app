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

  @ViewChild('toast') toastViewChild: ElementRef | undefined;

  //change this to AfterViewInit
  ngAfterViewChecked(): void {
    console.log(this.toastViewChild?.nativeElement);

    setTimeout(() => {
      // this.toastViewChild?.nativeElement.parentElement.remove();
      if (this.toastViewChild) {
        this.toastViewChild.nativeElement.parentElement.style.display = 'block';
      }
    }, 10000);
  }

  accept() {
    console.log('inside accept in toast');
  }

  deny() {
    console.log('inside deny in toast');
  }
}
