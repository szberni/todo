import { AfterViewInit, Directive, ElementRef, HostListener } from '@angular/core';

const MIN_HEIGHT = 50;
const MAX_HEIGHT = 200;

@Directive({
  selector: '[appResizableTextarea]',
})
export class ResizableTextareaDirective implements AfterViewInit {
  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit(): void {
    this.resize();
  }

  @HostListener('input')
  private onInput(): void {
    this.resize();
  }

  private resize(): void {
    const element: HTMLTextAreaElement = this.elementRef.nativeElement;

    element.style.height = '0';

    if (element.scrollHeight < MIN_HEIGHT) {
      element.style.height = `${MIN_HEIGHT}px`;

      return;
    }

    element.style.height =
      element.scrollHeight > MAX_HEIGHT ? `${MAX_HEIGHT}px` : `${element.scrollHeight}px`;
  }
}
