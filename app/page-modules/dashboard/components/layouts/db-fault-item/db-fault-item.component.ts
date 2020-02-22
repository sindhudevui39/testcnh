import { Component, OnInit, Input } from '@angular/core';

import { Fault } from '@dashboard/models/db-fault.model';

@Component({
  selector: 'db-fault-item',
  templateUrl: './db-fault-item.component.html',
  styleUrls: ['./db-fault-item.component.css']
})
export class DbFaultItemComponent implements OnInit {
  @Input()
  fault: Fault;

  constructor() {}

  ngOnInit() {}

  onNavigate() {
    const val = 'ZCRC08224|10001';
    window.open(
      'https://portal.cnh.com/dp6/PA_CNHDPLinksAndTools/displaytool?name=TIDB&extraSsoName=PIN|faultcode&extraSsoValue=' +
        val,
      '_blank'
    );
  }
}
