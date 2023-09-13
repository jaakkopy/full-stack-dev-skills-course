import { Component, inject } from '@angular/core';
import { Group } from 'src/app/interfaces/group';
import { GroupService } from 'src/app/services/group.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html'
})
export class GroupsComponent {
  groupService: GroupService = inject(GroupService);
  groupData: [Group] = [{id: '', name: ''}];
  
  ngOnInit() {
    // fetch group data for the logged in user
    const observable = this.groupService.getUserGroupData();
    if (observable == null) {
      // TODO: notify of error
      return;
    }
    observable.subscribe(response => {
      if (response.success) {
        this.groupData = response.content;
      }
    });
  }
}
