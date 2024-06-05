import { Injectable } from '@angular/core';
import { environment } from './environments/environments';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { createRequestOption } from './util/util';
import { BodyType } from '../@types';

@Injectable({
  providedIn: 'root'
})

export class AppService {
  private resourceUrl = environment.apiUrl;

  constructor(
    protected http: HttpClient
  ) { }
  public changeResourceUrl(url: string) {
    this.resourceUrl = url;
  }

  create<T, V>(body: V, url: string, headers?: HttpHeaders): Observable<HttpResponse<BodyType<T>>> {
    return this.http.post<BodyType<T>>(this.resourceUrl + url, body, {
      headers: headers,
      observe: 'response',
    });
  }

  update<T, V>(body: V, url: string, headers?: HttpHeaders): Observable<HttpResponse<BodyType<T>>> {
    return this.http.patch<BodyType<T>>(this.resourceUrl + url, body, {
      headers: headers,
      observe: 'response',
    });
  }

  find<T>(url: string, headers?: HttpHeaders): Observable<HttpResponse<BodyType<T>>> {
    return this.http.get<BodyType<T>>(this.resourceUrl + url, {
      headers: headers,
      observe: 'response',
    });
  }

  getById<T>(id: string, url: string, headers?: HttpHeaders): Observable<HttpResponse<BodyType<T>>> {
    return this.http.get<BodyType<T>>(this.resourceUrl + url + '/' + id, {
      headers: headers,
      observe: 'response',
    });
  }

  query<T>(req?: any, url?: string, headers?: HttpHeaders): Observable<HttpResponse<BodyType<T>>> {
    const options = createRequestOption(req);
    return this.http.get<BodyType<T>>(this.resourceUrl + url, {
      params: options,
      headers: headers,
      observe: 'response',
    });
  }

  delete<T>(url: string, headers?: HttpHeaders): Observable<HttpResponse<BodyType<T>>> {
    return this.http.delete<BodyType<T>>(this.resourceUrl + url, {
      headers: headers,
      observe: 'response',
    });
  }

  deleteOption<T>(id:string, url: string, headers?: HttpHeaders): Observable<HttpResponse<BodyType<T>>> {
    return this.http.delete<BodyType<T>>(this.resourceUrl + url + '/' + id, {
      headers: headers,
      observe: 'response',
    });
  }

  postOption<T, V>(body: V, url: string, headers?: HttpHeaders): Observable<HttpResponse<BodyType<T>>> {
    return this.http.post<BodyType<T>>(this.resourceUrl + url, body, {
      headers: headers,
      observe: 'response',
    });
  }

  postByOption<T, V>(body: V, url: string, headers?: HttpHeaders): Observable<HttpResponse<BodyType<T>>> {
    return this.http.post<BodyType<T>>(this.resourceUrl + url, body, {
      headers: headers,
      observe: 'response',
    });
  }

  getOption<T>(params: HttpParams, url: string, headers?: HttpHeaders): Observable<HttpResponse<BodyType<T>>> {
    return this.http.get<BodyType<T>>(this.resourceUrl + url, {
      headers: headers,
      params: params,
      observe: 'response',
    });
  }

  getByOption<T>(params: HttpParams, url: string, headers?: HttpHeaders): Observable<HttpResponse<BodyType<T>>> {
    return this.http.get<BodyType<T>>(this.resourceUrl + url, {
      headers: headers,
      params: params,
      observe: 'response',
    });
  }

  putOption<T, V>(body: V, url: string, headers?: HttpHeaders): Observable<HttpResponse<BodyType<T>>> {
    return this.http.put<BodyType<T>>(this.resourceUrl + url, body, {
      headers: headers,
      observe: 'response',
    });
  }

  get<T>(params: HttpParams, url: string, headers?: HttpHeaders): Observable<HttpResponse<BodyType<T>>> {
    return this.http.get<BodyType<T>>(this.resourceUrl + url, {
      headers: headers,
      params: params,
      observe: 'response',
    });
  }
  post<T, V>(body: V, url: string, headers?: HttpHeaders): Observable<HttpResponse<BodyType<T>>> {
    return this.http.post<BodyType<T>>(this.resourceUrl + url, body, {
      headers: headers,
      observe: 'response',
    });
  }
}
