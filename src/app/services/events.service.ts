import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(private http: HttpClient) { }

  public getEvents(): Observable<any> {
    return this.http.get<any>('https://graph.microsoft.com/v1.0/me/events?$select=subject,body,bodyPreview,organizer,start,end,changeKey');
  }

  public getEventsByNextLink(nextLink: string): Observable<any> {
    return this.http.get<any>(nextLink);
  }
}
