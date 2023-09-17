import { Component, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NewShoppingListItem } from 'src/app/interfaces/new-shopping-list-item';
import { ShoppingList } from 'src/app/interfaces/shopping-list';
import { ListService } from 'src/app/services/list.service';
import { showSuccessMessage, showFailureMessage, showInfoMessage, showConfirmation } from 'src/app/services/notifications';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html'
})
export class ListComponent {
  list: ShoppingList | null = null;
  listService: ListService = inject(ListService);
  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);
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
      showFailureMessage("No list id supplied");
      this.router.navigate(['/groups']);
      return;
    }
    // fetch lists for the given group 
    const observable = this.listService.getListData(this.listId);
    if (observable == null) {
      showFailureMessage("Service error");
      return;
    }
    observable.subscribe(response => {
      if (response?.success) {
        this.list = response.content;
      } else {
        // TODO: notify of error
        showFailureMessage(response.content);
      }
    }, (err) => { showFailureMessage(err.error.content); });
  }

  deleteList() {
    if (!this.listId || !this.list) {
      showFailureMessage("No list id supplied");
      this.router.navigate(['/groups']);
      return;
    }

    const onAgree = () => {
      this.listService.deleteList(this.listId!)?.subscribe(res => {
        if (res.success) {
          showSuccessMessage("List deleted").then(() => this.router.navigate(['/lists']));
        } else {
          showFailureMessage(res.content);
        }
      }, (err) => { showFailureMessage(err.error.content); });
    }

    showConfirmation(`Do you really want to delete list ${this.list.name}?`).then((result) => {
      if (result.isConfirmed) {
        onAgree();
      }
    });
  }

  onNewItemSubmit() {
    if (!this.itemForm.value?.name || !this.itemForm.value?.quantity) {
      showInfoMessage("The item needs at least a name and a quantity");
      return;
    }
    if (!this.listId) {
      showFailureMessage("No list id supplied").then(() => this.router.navigate(['/groups']));
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
      showFailureMessage("Service error");
      return;
    }
    observable.subscribe(response => {
      if (response?.success) {
        this.list?.items.push({ _id: response.content, ...newItem });
        showSuccessMessage("New item added");
      } else {
        showFailureMessage(response.content);
      }
    }, (err) => { showFailureMessage(err.error.content) });
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
      showInfoMessage("Please choose an item to delete first");
      return;
    }
    const observable = this.listService.deleteListItem(this.list.id, this.selectedItemId);
    if (observable == null) {
      showFailureMessage("Service error");
      return;
    }
    observable.subscribe(response => {
      if (response.success && this.list != null) {
        this.list.items = this.list.items.filter(i => i._id !== this.selectedItemId);
        showSuccessMessage("Item deleted");
      } else {
        showFailureMessage(response.content);
      }
    }, (err) => { showFailureMessage(err.error.content); });
  }

  onItemUpdated() {
    if (this.selectedItemId === null || this.list == null) {
      showInfoMessage("Please choose an item to update first");
      return;
    }
    const observable = this.listService.updateListItem(this.list.id, this.selectedItemId, this.itemForm.value);
    if (observable == null) {
      showFailureMessage("Service error");
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
        showSuccessMessage("Item updated");
      } else {
        showFailureMessage(response.content);
      }
    }, (err) => { showFailureMessage(err.error.content); });
  }
}
