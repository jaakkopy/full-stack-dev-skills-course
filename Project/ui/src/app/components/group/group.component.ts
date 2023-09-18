import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupService } from 'src/app/services/group.service';
import { showConfirmation, showFailureMessage, showSuccessMessage } from 'src/app/services/notifications';

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
      showFailureMessage("No group id supplied").then(() => this.router.navigate(['/groups']));
      return;
    }
    // fetch lists for the given group 
    const observable = this.groupService.getGroupById(this.groupId);
    if (observable == null) {
      showFailureMessage("Service error").then(() => this.router.navigate(['/groups']));
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
    if (!this.groupId) {
      showFailureMessage("No group id supplied").then(() => this.router.navigate(['/groups']));
      return;
    }

    const onAgree = () => {
      this.groupService.deleteGroup(this.groupId!)?.subscribe(res => {
        if (res?.success) {
          showSuccessMessage("Group deleted").then(() => this.router.navigate(['/groups']));
        } else {
          showFailureMessage(res.content);
        }
      }, (err) => {
        showFailureMessage(err.error.content);
      });
    }

    showConfirmation(`Do you really want to delete group ${this.groupData.name}?`).then((result) => {
      if (result.isConfirmed) {
        onAgree();
      } 
    });
  }

  leaveGroup() {
    if (!this.groupId) {
      showFailureMessage("No group id supplied").then(() => this.router.navigate(['/groups']));
      return;
    }

    const onAgree = () => {
      this.groupService.leaveGroup(this.groupId!)?.subscribe(res => {
        if (res?.success) {
          showSuccessMessage("Group left").then(() => this.router.navigate(['/groups']));
        } else {
          showFailureMessage(res.content);
        }
      }, (err) => {
        showFailureMessage(err.error.content);
      });
    }

    showConfirmation(`Do you really want to leave group ${this.groupData.name}?`).then((result) => {
      if (result.isConfirmed) {
        onAgree();
      } 
    });
  }
}
