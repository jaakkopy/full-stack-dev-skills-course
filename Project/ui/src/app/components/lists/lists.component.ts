import { Component, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ShoppingList } from 'src/app/interfaces/shopping-list';
import { ListService } from 'src/app/services/list.service';
import { showFailureMessage, showInfoMessage, showSuccessMessage } from 'src/app/services/notifications';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html'
})
export class ListsComponent {
  lists: ShoppingList[] = [];
  listService: ListService = inject(ListService);
  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);
  groupId: string | null = null;
  groupName: string | null = null;

  newListForm = new FormGroup({
    name: new FormControl(''),
    date: new FormControl()
  });

  ngOnInit() {
    this.groupId = this.route.snapshot.params['groupid']
    if (this.groupId == null) {
      showFailureMessage("No group id supplied");
      this.router.navigate(['/groups']);
      return;
    }
    // fetch lists for the given group 
    const observable = this.listService.getListsForGroup(this.groupId);
    if (observable == null) {
      showFailureMessage("Service error").then(() => this.router.navigate(['/groups']));
      return;
    }
    observable.subscribe(response => {
      if (response?.success) {
        this.lists = response.content.lists;
        this.groupName = response.content.name;
      } else {
        showFailureMessage(response.content);
      }
    }, (err) => { showFailureMessage(err.error.message) });
  }

  onNewListSubmission() {
    if (!this.newListForm.value.name || !this.newListForm.value.date) {
      showInfoMessage("Please provide a name and date for the list");
      return;
    }
    const name = this.newListForm.value.name;
    const date = this.newListForm.value.date;
    this.listService.createList(this.groupId!, name, date)?.subscribe(res => {
      if (res.success) {
        showSuccessMessage("List created");
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
        showFailureMessage(res.content);
      }
    }, (err) => {showFailureMessage(err.error.content)});
  }

}
