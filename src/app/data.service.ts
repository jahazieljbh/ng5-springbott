import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GoalsApi } from './goalsApi';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class DataService {

  private goals = new BehaviorSubject<any>(['The initial goal', 'Another silly life goal']);
  goal = this.goals.asObservable();

  constructor(private http: HttpClient) { }

  changeGoal(goal) {
    this.goals.next(goal);
  }

  #apiURL = 'http://localhost:8080';
  apiURL = 'http://104.198.244.0:5004';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin':'*'
      })
  }

  getGoals(): Observable<GoalsApi> {
    return this.http.get<GoalsApi>(this.apiURL + '/questions', this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  newGoal(payload): Observable<GoalsApi> {
    return this.http.post<GoalsApi>(this.apiURL + '/questions', JSON.stringify(payload), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

  handleError(error) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
 }
}
