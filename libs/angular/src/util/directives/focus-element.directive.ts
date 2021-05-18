import { Directive, ElementRef } from "@angular/core";

@Directive({
  selector: "[dtFocusElement]"
})
export class FocusElementDirective {
  constructor(private el: ElementRef) {
    if (!el.nativeElement["focus"]) {
      throw new Error("Element does not accept focus.");
    }
  }
  focus() {
    this.el.nativeElement.focus();
    // this.el.nativeElement.select();
  }
}
