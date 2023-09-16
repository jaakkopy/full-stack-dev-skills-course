import { Component, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ShoppingList } from 'src/app/interfaces/shopping-list';
import { ListService } from 'src/app/services/list.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html'
})
export class ListsComponent {
  lists: ShoppingList[] = [];
  listService: ListService = inject(ListService);
  route: ActivatedRoute = inject(ActivatedRoute);
  groupId: string | null = null;
  groupName: string | null = null;
  
  newListForm = new FormGroup({
    name: new FormControl(''),
    date: new FormControl('')
  });

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
        this.lists = response.content.lists;
        this.groupName = response.content.name;
      } else {
        // TODO: notify of error
      }
    });
  }

  onNewListSubmission() {
    if (this.groupId && this.newListForm.value.name && this.newListForm.value.date) {
      const name = this.newListForm.value.name;
      const date = this.newListForm.value.date;
      this.listService.createList(this.groupId, name, date)?.subscribe(res => {
        if (res.success) {
          // TODO: notify of success
          const user = JSON.parse(localStorage.getItem('user')!);
          const add = {
            id: res.content,
            creatorName: user.username,
            name: name,
            date: date,
            items: [] 
          }
          this.lists.push(add);
        } else {
          // TODO: notify of failure 
        }
      })
    }
  }

}
