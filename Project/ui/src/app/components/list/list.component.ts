import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShoppingList } from 'src/app/interfaces/shopping-list';
import { ListService } from 'src/app/services/list.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html'
})
export class ListComponent {
  list: ShoppingList | null = null;
  listService: ListService = inject(ListService);
  route: ActivatedRoute = inject(ActivatedRoute);
  listId: String | null = null;

  ngOnInit() {
    this.listId = this.route.snapshot.params['listid']
    if (this.listId == null) {
      // TODO: notify of error
      return;
    }
    // fetch lists for the given group 
    const observable = this.listService.getListData(this.listId);
    if (observable == null) {
      // TODO: notify of error
      return;
    }
    observable.subscribe(response => {
      if (response?.success) {
        this.list = response.content;
        console.log(this.list);
      } else {
        // TODO: notify of error
      }
    });
  }
}
