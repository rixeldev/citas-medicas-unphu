import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth/auth.service';
import { interval } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Rentcar';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Check session every minute
    interval(60000).subscribe(() => {
      this.authService.checkSession();
    });

    // Immediate check on load
    this.authService.checkSession();
  }
}
