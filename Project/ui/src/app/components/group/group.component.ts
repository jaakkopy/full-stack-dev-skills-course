import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupService } from 'src/app/services/group.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html'
})
export class GroupComponent {
  groupId: string | null = null;
  route: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);
  groupService: GroupService = inject(GroupService);
  groupData: any;

  ngOnInit() {
    this.groupId = this.route.snapshot.params['groupid'];
    if (this.groupId == null) {
      // TODO: notify of error
      return;
    }
    // fetch lists for the given group 
    const observable = this.groupService.getGroupById(this.groupId);
    if (observable == null) {
      // TODO: notify of error
      return;
    }
    observable.subscribe(response => {
      if (response?.success) {
        this.groupData = response.content;
        console.log(this.groupData);
      } else {
        // TODO: notify of error
      }
    });
  }

  deleteGroup() {
    if (this.groupId != null) {
      this.groupService.deleteGroup(this.groupId)?.subscribe(res => {
        if (res?.success) {
          // TODO: notify of success
          this.router.navigate(['/groups']);
        } else {
          // TODO: notify of failure 
        }
      });
    }
  }

  showGroupsLists() {
    if (this.groupId) {
      this.router.navigate(['/lists', this.groupId]);
    }
  }

  showGroupsStats() {
    if (this.groupId) {
      this.router.navigate(['/stats', this.groupId]);
    }
  }

}
