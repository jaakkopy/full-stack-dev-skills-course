import { Component, inject } from '@angular/core';
import { ListService } from 'src/app/services/list.service';
import { showFailureMessage } from 'src/app/services/notifications';

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
      showFailureMessage("Service error");
      return;
    }
    observable.subscribe(response => {
      if (response?.success) {
        this.lists = response.content;
      } else {
        showFailureMessage(response.content);
      }
    }, (err) => {
      showFailureMessage(err.error.content);
    });
  }
}
