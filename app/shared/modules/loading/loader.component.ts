import { Component, OnInit } from '@angular/core';
import { UserService } from '@services/user/user.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {
  borderColor: string;

  constructor(private userService: UserService) {}

  ngOnInit() {
    if (this.userService.getBrand() === 'Case IH') {
      this.borderColor = 'var(--color-primary-caseih)';
    } else {
      this.borderColor = 'var(--color-primary-nh)';
    }
  }
}
