import { Injectable } from "@angular/core";
import { MatPaginatorIntl } from "@angular/material/paginator";
import { TranslateService } from "@ngx-translate/core";

@Injectable({ providedIn: "root" })
export class PaginatorIntlService extends MatPaginatorIntl {
  constructor(private translate: TranslateService) {
    super();

    this.translate.onLangChange.subscribe(() => {
      this.translateLabels();
    });

    this.translateLabels();
  }
  itemsPerPageLabel = "Items per page";
  nextPageLabel = "Next page";
  previousPageLabel = "Previous page";
  getRangeLabel = (page: number, pageSize: number, length: number) => {
    const of = this.translate ? this.translate.instant("paginator.of") : "of";
    if (length === 0 || pageSize === 0) {
      return "0 " + of + " " + length;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex =
      startIndex < length
        ? Math.min(startIndex + pageSize, length)
        : startIndex + pageSize;
    return startIndex + 1 + " - " + endIndex + " " + of + " " + length;
  };

  translateLabels() {
    this.itemsPerPageLabel = this.translate.instant("paginator.items_per_page");
    this.firstPageLabel = this.translate.instant("paginator.first_page");
    this.previousPageLabel = this.translate.instant("paginator.previous_page");
    this.nextPageLabel = this.translate.instant("paginator.next_page");
    this.lastPageLabel = this.translate.instant("paginator.last_page");
    this.changes.next();
  }
}
