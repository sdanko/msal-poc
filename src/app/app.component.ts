import { Component } from '@angular/core';
import {EmailsService} from './services/emails.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private emailsService: EmailsService) {
  }

  title = 'msal-poc';
}
