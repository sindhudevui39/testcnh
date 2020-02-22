import { Component, OnInit, Inject, Input } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material';
import { SnackBar } from '@models/snack-bar';

@Component({
  selector: 'app-snack-bar',
  template: '{{ snackData }}',
  styleUrls: ['./snack-bar.component.css']
})
export class SnackBarComponent implements OnInit {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public snackData: SnackBar) {}

  ngOnInit() {}
}
