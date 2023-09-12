import { Component, inject } from '@angular/core';
import { Group } from 'src/app/interfaces/group';
import { AuthService } from 'src/app/services/auth.service';
import { GroupService } from 'src/app/services/group.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent {
  authService: AuthService = inject(AuthService);
  groupService: GroupService = inject(GroupService);
  groupData: [Group] = [{id: '', name: ''}];
  
  ngOnInit() {
    // fetch group data for the logged in user
    const observable = this.groupService.getUserGroupData();
    if (observable == null) {
      return;
    }
    observable.subscribe(response => {
      if (response.success) {
        this.groupData = response.content;
      }
    });
  }
}
