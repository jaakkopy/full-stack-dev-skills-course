import { Component, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Group } from 'src/app/interfaces/group';
import { GroupService } from 'src/app/services/group.service';
import { showFailureMessage } from 'src/app/services/notifications';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html'
})
export class GroupsComponent {
  groupService: GroupService = inject(GroupService);
  groups: Group[] = [];
  searchedGroups: Group[] = [];
  clickedId: string | null = null;
  clickedName: string | null = null;
  batchNum = 0;
  lastBatch = false;
  newGroupForm = new FormGroup({
    name: new FormControl(''),
    password: new FormControl('')
  });

  ngOnInit() {
    // fetch group data for the logged in user
    const observable = this.groupService.getUserGroupData();
    if (observable == null) {
      showFailureMessage("Service error");
      return;
    }
    observable.subscribe(response => {
      if (response.success) {
        this.groups = response.content;
      }
    });
  }

  onNewGroupSubmission() {
    if (this.newGroupForm.value.name && this.newGroupForm.value.password) {
      const name = this.newGroupForm.value.name;
      const password = this.newGroupForm.value.password;
      this.groupService.createGroup(name, password)?.subscribe(res => {
        if (res.success) {
          this.groups.push({ name, id: res.content });
        } else {
          showFailureMessage(res.content);
        }
      }, (err) => {
        showFailureMessage(err.error.content);
      });
    }
  }

  onSearchGroupSubmission() {
    if (this.newGroupForm.value.name) {
      this.groupService.getGroupByNamePattern(this.newGroupForm.value.name, 0)?.subscribe(res => {
        if (res.success) {
          if (res.content.lastBatch) {
            this.lastBatch = true;
          } else {
            this.lastBatch = false;
          }
          this.searchedGroups = res.content.groups;
        } else {
          showFailureMessage(res.content);
        }
      }, (err) => {showFailureMessage(err.error.content);});
    }
  }

  setClickedGroupInfo(id: string, name: string) {
    this.clickedId = id;
    this.clickedName = name;
  }

  onSearchForMoreResultsClick() {

  }

  onJoinGroupSubmission() {
    const groupName = this.clickedName;
    const givenPassword = this.newGroupForm.value.password;
    if (groupName && givenPassword) {
      this.groupService.joinGroup(groupName, givenPassword)?.subscribe(res => {
        if (res.success) {
          this.groups.push({ name: groupName, id: res.content });
        } else {
          showFailureMessage(res.content);
        }
      }, (err) => {
        showFailureMessage(err.error.content);
      });
    }
  }

}
