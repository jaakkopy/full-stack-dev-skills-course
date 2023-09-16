import { Component, inject } from '@angular/core';
import { ListService } from 'src/app/services/list.service';

@Component({
  selector: 'app-all-lists',
  templateUrl: './all-lists.component.html'
})
export class AllListsComponent {
  lists: any[] = [];
  listService: ListService = inject(ListService);

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
}
