import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ShoppingList } from 'src/app/interfaces/shopping-list';
import { ShoppingListIdentifier } from 'src/app/interfaces/shoppingListIdentifier';
import { ListService } from 'src/app/services/list.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html'
})
export class ListsComponent {
  lists: ShoppingList[] = [];
  listService: ListService = inject(ListService);
  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);
  groupId: String | null = null;
  selectedItemId: string | null = null;

  ngOnInit() {
    this.groupId = this.route.snapshot.params['groupid']
    if (this.groupId == null) {
      // TODO: notify of error
      return;
    }
    // fetch lists for the given group 
    const observable = this.listService.getListsForGroup(this.groupId);
    if (observable == null) {
      // TODO: notify of error
      return;
    }
    observable.subscribe(response => {
      if (response?.success) {
        this.lists = response.content;
        console.log(this.lists);
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

  deleteSelectedList() {
    if (this.selectedItemId != null) {
      this.listService.deleteList(this.selectedItemId)?.subscribe(res => {
        if (res.success) {
          this.lists = this.lists.filter(l => l.id !== this.selectedItemId);
          // TODO: notify of success
        } else {
          // TODO: notify of failure 
        }
      });
    }
  }

}
