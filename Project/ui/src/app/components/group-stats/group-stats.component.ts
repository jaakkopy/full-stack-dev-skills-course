import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ListService } from 'src/app/services/list.service';

@Component({
  selector: 'app-group-stats',
  templateUrl: './group-stats.component.html'
})
export class GroupStatsComponent {
  groupId: string | null = null;
  route: ActivatedRoute = inject(ActivatedRoute);
  listService: ListService = inject(ListService);

  ngOnInit() {
    this.groupId = this.route.snapshot.params['groupid']
    if (this.groupId == null) {
      // TODO: notify of error
      return;
    }
    const observable = this.listService.getListStatsForGroup(this.groupId);
    if (observable == null) {
      // TODO: notify of error
      return;
    }
    observable.subscribe(response => {
      if (response?.success) {
        console.log(response.content);
      } else {
        // TODO: notify of error
      }
    });
  }

}
