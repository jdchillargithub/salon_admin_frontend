import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../services/loadingService';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.html',
  styleUrls: ['style.css']
})
export class LoaderComponent implements OnInit {
  loaderVisible = false;

  constructor(private loaderService: LoaderService) { }

  ngOnInit() {
    this.loaderService.loaderVisibility$.subscribe((visible: boolean) => {
      this.loaderVisible = visible;
    });
  }
}
