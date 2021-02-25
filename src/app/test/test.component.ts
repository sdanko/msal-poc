import { Component, OnInit } from '@angular/core';
import { expand, map, reduce } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { EventsService } from '../services/events.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

  constructor(private eventsService: EventsService) {
  }

  ngOnInit(): void {
    this.importEvents();
  }

  private importEvents(): void {
    this.eventsService.getEvents().pipe(
      expand(result => {
        if (result.value && result.value.length > 0 && result['@odata.nextLink']) {
          return this.eventsService.getEventsByNextLink(result['@odata.nextLink']);
        } else {
          return EMPTY;
        }
      }),
      map(result => {
        if (result.value && result.value.length > 0) {
          return result.value.flatMap((array: any, index: number) => array)
        } else {
          return [];
        }
      }),
      reduce((acc, x) => acc.concat(x), []),
    ).subscribe((results: any) => {
        console.log(results);
      }, error => {
        console.error(error);
      }
    );
  }
}
