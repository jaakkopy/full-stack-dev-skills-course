import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupService } from 'src/app/services/group.service';
import { showFailureMessage, showSuccessMessage } from 'src/app/services/notifications';

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
      showFailureMessage("No group id supplied");
      return;
    }
    // fetch lists for the given group 
    const observable = this.groupService.getGroupById(this.groupId);
    if (observable == null) {
      showFailureMessage("Service error");
      return;
    }
    observable.subscribe(response => {
      if (response?.success) {
        this.groupData = response.content;
      } else {
        showFailureMessage(response.content);
      }
    });
  }

  deleteGroup() {
    if (this.groupId != null) {
      this.groupService.deleteGroup(this.groupId)?.subscribe(res => {
        if (res?.success) {
          showSuccessMessage("Group deleted").then(() => this.router.navigate(['/groups']));
        } else {
          showFailureMessage(res.content);
        }
      }, (err) => {
        showFailureMessage(err.error.content);
      });
    }
  }

}
