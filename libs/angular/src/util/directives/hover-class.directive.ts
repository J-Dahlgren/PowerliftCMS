import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  Renderer2
} from "@angular/core";

@Directive({
  selector: "[dtHoverClass]"
})
export class HoverClassDirective {
  @Input() classes: string[] = [];

  constructor(private renderer: Renderer2, private el: ElementRef) {}
  @HostListener("mouseenter") onMouseEnter() {
    this.setClasses(true);
  }

  @HostListener("mouseleave") onMouseLeave() {
    this.setClasses(false);
  }
  private setClasses(enabled: boolean) {
    this.classes.forEach(c => {
      if (enabled) {
        this.renderer.addClass(this.el.nativeElement, c);
      } else {
        this.renderer.removeClass(this.el.nativeElement, c);
      }
    });
  }
}
