import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ListService } from 'src/app/services/list.service';

@Component({
  selector: 'app-all-lists',
  templateUrl: './all-lists.component.html'
})
export class AllListsComponent {
  lists: any[] = [];
  listService: ListService = inject(ListService);
  router: Router = inject(Router);
  selectedItemId: string | null = null;

  ngOnInit() {
    const observable = this.listService.getListsForUser();
    if (observable == null) {
      // TODO: notify of error
      return;
    }
    observable.subscribe(response => {
      if (response?.success) {
        this.lists = response.content;
      } else {
        // TODO: notify of error
      }
    });
  }

  setSelectedListItem(itemId: string) {
    const element = document.getElementById(itemId);
    if (this.selectedItemId != null) {
      const previousSelected = document.getElementById(this.selectedItemId);
      previousSelected?.setAttribute('aria-current', 'false');
      previousSelected?.classList.remove('active')
    }
    element?.setAttribute('aria-current', 'true');
    element?.classList.add('active');
    this.selectedItemId = itemId;
  }

  showSelectedList() {
    if (this.selectedItemId != null) {
      this.router.navigate(['/list', this.selectedItemId]);
    }
  }
}
