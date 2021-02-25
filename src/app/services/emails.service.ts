import { Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { HttpClient } from '@angular/common/http';
import { expand, map, reduce } from 'rxjs/operators';
import { EMPTY, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailsService {

  constructor(private http: HttpClient, private msalService: MsalService) {
    this.checkForEmails();
    // TODO: check if user is logged in, then fetch emails
    /*const accessTokenRequest = {
      scopes: ['User.ReadWrite', 'Calendars.Read', 'Calendars.ReadWrite', 'Mail.Read', 'openid', 'profile']
    };
    this.msalService.acquireTokenSilent(accessTokenRequest).subscribe((result: any) => {
      if (result) {
        this.checkForEmails();
      }
    });*/
  }

  private checkForEmails(): void {
    const currentTimestamp = new Date().getTime();
    const lastUpdateTimestamp = currentTimestamp - 86400000; // fetch messages from last 24 hrs
    this.getOutlookEmails(currentTimestamp, lastUpdateTimestamp).pipe(
      expand(result => {
        if (result.value && result.value.length > 0 && result['@odata.nextLink']) {
          return this.getEmailsByNextLink(result['@odata.nextLink']);
        } else {
          return EMPTY;
        }
      }),
      map(result => {
        if (result.value && result.value.length > 0) {
          return result.value;
        } else {
          return [];
        }
      }),
      reduce((acc, x) => acc.concat(x), [])
    ).subscribe((results: any) => {
        console.log(results);
      }, error => {
        console.error(error);
      }
    );
  }

  private getOutlookEmails(currentTimestamp: number, lastUpdateTimestamp: number): Observable<any> {
    return this.http.get<any>(`https://graph.microsoft.com/v1.0/me/mailFolders/inbox/messages?$filter=ReceivedDateTime ge ` +
      `${new Date(lastUpdateTimestamp).toISOString()} and receivedDateTime lt ${new Date(currentTimestamp).toISOString()}`);
  }

  private getEmailsByNextLink(nextLink: string): Observable<any> {
    return this.http.get<any>(nextLink);
  }
}
