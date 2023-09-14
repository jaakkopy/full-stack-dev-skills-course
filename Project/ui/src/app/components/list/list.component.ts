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
  itemForm = new FormGroup({
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
    if (!this.itemForm.value?.name || !this.itemForm.value?.quantity) {
      // Todo: notify of error
      return;
    }
    if (!this.listId) {
      // Todo: notify of error
      return;
    }
    const newItem: NewShoppingListItem = {
      name: this.itemForm.value.name,
      quantity: this.itemForm.value.quantity,
      price: this.itemForm.value?.price,
      category: this.itemForm.value?.category,
      comment: this.itemForm.value?.comment
    };
    const observable = this.listService.postNewListItem(this.listId, newItem);
    if (observable == null) {
      // Todo: notify of error
      return;
    }
    observable.subscribe(response => {
      if (response?.success) {
        this.list?.items.push({_id: response.content, ...newItem});
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
    const observable = this.listService.deleteListItem(this.list.id, this.selectedItemId);
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

  onItemUpdated() {
    if (this.selectedItemId === null || this.list == null) {
      // TODO: notify
      return;
    }
    const observable = this.listService.updateListItem(this.list.id, this.selectedItemId, this.itemForm.value);
    if (observable == null) {
      // TODO: notify of failure
      return;
    }
    observable.subscribe(response => {
      if (response.success && this.list != null) {
        let item = this.list.items.find(i => i._id === this.selectedItemId);
        const vals = this.itemForm.value;
        if (item && vals) {
          if (vals.name)
            item.name = vals.name;
          if (vals.quantity)
            item.quantity = vals.quantity;
          if (vals.price)
            item.price = vals.price;
          if (vals.category)
            item.category = vals.category;
          if (vals.comment)
            item.comment = vals.comment;
        }
        // TODO: notify of success
      } else {
        // TODO: notify of failure
      }
    })
  }
}
