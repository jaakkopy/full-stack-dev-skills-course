import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShoppingListIdentifier } from 'src/app/interfaces/shoppingListIdentifier';
import { ListService } from 'src/app/services/list.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html'
})
export class ListsComponent {
  lists: [ShoppingListIdentifier] = [{id: '', name: ''}];
  listService: ListService = inject(ListService);
  route: ActivatedRoute = inject(ActivatedRoute);
  groupId: String | null = null;

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
}
