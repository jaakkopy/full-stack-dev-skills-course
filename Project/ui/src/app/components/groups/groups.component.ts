import { Component, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Group } from 'src/app/interfaces/group';
import { GroupService } from 'src/app/services/group.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html'
})
export class GroupsComponent {
  groupService: GroupService = inject(GroupService);
  groups: Group[] = [];
  selectedItemId: string | null = null;
  router: Router = inject(Router);
  newGroupForm = new FormGroup({
    name: new FormControl(''),
    password: new FormControl('')
  });

  ngOnInit() {
    // fetch group data for the logged in user
    const observable = this.groupService.getUserGroupData();
    if (observable == null) {
      // TODO: notify of error
      return;
    }
    observable.subscribe(response => {
      if (response.success) {
        this.groups = response.content;
      }
    });
  }

  showSelectedGroup() {
    if (this.selectedItemId) {
      this.router.navigate(['/group', this.selectedItemId]);
    }
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

  onNewGroupSubmission() {
    if (this.newGroupForm.value.name && this.newGroupForm.value.password) {
      const name = this.newGroupForm.value.name;
      const password = this.newGroupForm.value.password;
      this.groupService.createGroup(name, password)?.subscribe(res => {
        if (res.success) {
          this.groups.push({name, id: res.content});
        } else {
          // TODO: notify of failure 
        }
      })
    }
  }

  onJoinGroupSubmission() {
  if (this.newGroupForm.value.name && this.newGroupForm.value.password) {
      const name = this.newGroupForm.value.name;
      const password = this.newGroupForm.value.password;
      this.groupService.joinGroup(name, password)?.subscribe(res => {
        if (res.success) {
          this.groups.push({name, id: res.content});
        } else {
          // TODO: notify of failure 
        }
      })
    }
  }
}
