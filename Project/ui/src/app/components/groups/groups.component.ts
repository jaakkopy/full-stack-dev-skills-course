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
  groupIds = new Set();
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
        this.groups.forEach(g => this.groupIds.add(g.id));
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

  private loadSearchResults() {
    if (this.newGroupForm.value.name) {
      this.groupService.getGroupByNamePattern(this.newGroupForm.value.name, this.batchNum)?.subscribe(res => {
        if (res.success) {
          if (res.content.lastBatch) {
            this.lastBatch = true;
          } else {
            this.lastBatch = false;
          }
          this.searchedGroups = res.content.groups;
          this.searchedGroups = this.searchedGroups.filter(g => !this.groupIds.has(g.id)).sort();
        } else {
          showFailureMessage(res.content);
        }
      }, (err) => {showFailureMessage(err.error.content);});
    }
  }

  onSearchGroupSubmission() {
    this.batchNum = 0;
    this.loadSearchResults();  
  }

  setClickedGroupInfo(id: string, name: string) {
    this.clickedId = id;
    this.clickedName = name;
  }

  loadPreviousResults() {
    this.batchNum = Math.max(0, this.batchNum - 1);
    this.loadSearchResults();  
  }

  loadNextResults() {
    this.batchNum += 1;
    this.loadSearchResults();
  }

  onJoinGroupSubmission() {
    const groupName = this.clickedName;
    const givenPassword = this.newGroupForm.value.password;
    if (groupName && givenPassword) {
      this.groupService.joinGroup(groupName, givenPassword)?.subscribe(res => {
        if (res.success) {
          this.groups.push({ name: groupName, id: res.content });
          this.groupIds.add(res.content);
          this.searchedGroups = this.searchedGroups.filter(g => !this.groupIds.has(g.id)).sort();
        } else {
          showFailureMessage(res.content);
        }
      }, (err) => {
        showFailureMessage(err.error.content);
      });
    }
  }

}
