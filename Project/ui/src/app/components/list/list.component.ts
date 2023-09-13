import { Component, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NewShoppingListItem } from 'src/app/interfaces/new-shopping-list-item';
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
  listId: string | null = null;
  selectedItemId: string | null = null;
  newItemForm = new FormGroup({
    name: new FormControl(''),
    quantity: new FormControl(0),
    price: new FormControl(0),
    category: new FormControl(''),
    comment: new FormControl(''),
  });

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

  onNewItemSubmit() {
    if (!this.newItemForm.value?.name || !this.newItemForm.value?.quantity) {
      // Todo: notify of error
      return;
    }
    if (!this.listId) {
      // Todo: notify of error
      return;
    }
    const newItem: NewShoppingListItem = {
      name: this.newItemForm.value.name,
      quantity: this.newItemForm.value.quantity,
      price: this.newItemForm.value?.price,
      category: this.newItemForm.value?.category,
      comment: this.newItemForm.value?.comment
    };
    const observable = this.listService.postNewItem(this.listId, newItem);
    if (observable == null) {
      // Todo: notify of error
      return;
    }
    observable.subscribe(response => {
      if (response?.success) {
        this.list?.items.push(newItem);
        // TODO: notify of successful addition
      } else {
        // TODO: notify of error
      }
    });
  }

  // Set the id of the selected item. Add the active class to the selected item to visualize the selection for the user
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

  deleteSelectedItem() {
    if (this.selectedItemId === null || this.list == null) {
      // TODO: notify
      return;
    }
    const observable = this.listService.deleteItem(this.list.id, this.selectedItemId);
    if (observable == null) {
      // TODO: notify of failure
      return;
    }
    observable.subscribe(response => {
      if (response.success && this.list != null) {
        this.list.items = this.list.items.filter(i => i._id !== this.selectedItemId);
        // TODO: notify of success
      } else {
        // TODO: notify of failure
      }
    })
  }
}
