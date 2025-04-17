import { Component } from '@angular/core';

@Component({
  selector: 'app-home-page',
  standalone: false,
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {
  public isCollapsed = false;

  public toggleCollapsed(): void {
    this.isCollapsed = !this.isCollapsed;
  }
}
