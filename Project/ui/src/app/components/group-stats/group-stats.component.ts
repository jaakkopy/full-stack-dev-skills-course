import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ListService } from 'src/app/services/list.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-group-stats',
  templateUrl: './group-stats.component.html'
})
export class GroupStatsComponent {
  groupId: string | null = null;
  route: ActivatedRoute = inject(ActivatedRoute);
  listService: ListService = inject(ListService);
  purchaseCategoryDoughnutChart: any; 
  spendingCategoryPieChart: any; 
  listsPerWeekdayBarChart: any;
  stats: any;

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
        this.stats = response.content;
        if (!this?.stats?.totalRegisteredSpendingPerCategory || !this?.stats?.amountPurchasesByCategory || !this?.stats?.amountListsPerDay || !this?.stats?.mostPurchasedProduct || !this?.stats?.averageCostOfList) {
          // TODO: notify of error
          return;
        }
        this.createDoughnutOrPie('purchases-by-category', 'doughnut', 'Amount of purchases', this.stats.amountPurchasesByCategory, this.purchaseCategoryDoughnutChart);
        this.createDoughnutOrPie('spending-by-category', 'pie', 'Amount of Spending', this.stats.totalRegisteredSpendingPerCategory, this.spendingCategoryPieChart);
        this.createBarChar('lists-per-day', 'Shopping lists per weekday', this.stats.amountListsPerDay, this.listsPerWeekdayBarChart);
        document.getElementById('most-purchased-product')!.innerHTML = `The most purchased product is '${this.stats.mostPurchasedProduct[0]}' with a quantity of ${this.stats.mostPurchasedProduct[1]}`;
        document.getElementById('avg-cost-list')!.innerHTML = `The average cost for the shopping lists is ${this.stats.averageCostOfList}`;
      } else {
        // TODO: notify of error
      }
    });
  }

  private createDoughnutOrPie(key: string, type: 'doughnut' | 'pie', label: string, obj: Object, target: any) {
    let labels = [];
    let data = [];
    let backgroundColor = [];
    for (const [key, val] of Object.entries(obj)) {
      labels.push(key);
      data.push(val);
      backgroundColor.push(`rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`);
    }
    target = new Chart(key, {
      type,
      data: {
        labels,
        datasets: [{
          label,
          data,
          backgroundColor,
          hoverOffset: 4
        }]
      }
    });
  }

  private createBarChar(key: string, label: string, obj: Object, target: any) {
    let labels = [];
    let data = [];    
    let backgroundColor = [];
    let borderColor = [];

    for (const [key, val] of Object.entries(obj)) {
      labels.push(key);
      data.push(val);
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      backgroundColor.push(`rgba(${r}, ${g}, ${b}, 0.5)`);
      borderColor.push(`rgb(${r}, ${g}, ${b})`);
    }

    target = new Chart(key, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label,
          data,
          backgroundColor,
          borderColor,
          borderWidth: 1 
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
    }});
  }
}
