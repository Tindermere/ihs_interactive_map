import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Construction, CreateConstruction} from "../../models/Construction";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {Category} from "../../models/Category";

@Injectable({
  providedIn: "root"
})
export class ApiService {

  constructor(private _httpClient: HttpClient,) {
  }

  get baseUrl() {
    return environment ? environment.serviceUrl : ''
  }

  public getConstructions(searchtext = '', category?: Category): Observable<Construction[]> {
    let params = new HttpParams();
    params = params.append("searchString", searchtext);

    if (category) {
      params = params.append("category", category.toString());
    }

    return this._httpClient.get<Construction[]>(`${this.baseUrl}/constructions`, {
      params
    });
  }

  public getConstruction(id: string): Observable<Construction> {
    return this._httpClient.get<Construction>(`${this.baseUrl}/constructions/${id}`);
  }

  public postConstruction(construction: CreateConstruction) {
    let formData = new FormData();
    formData.append('structure', construction.structure)
    formData.append('city', construction.city)
    formData.append('latitude', construction.latitude.toString())
    formData.append('longitude', construction.longitude.toString())
    formData.append('architecture', construction.architecture)
    formData.append('constructionYear', construction.constructionYear?.toString())
    formData.append('link', construction.link)
    formData.append('fullName', construction.fullName)
    formData.append('email', construction.email)
    formData.append('phone', construction.phone)
    formData.append('description', construction.description)
    formData.append('category', construction.category)

    for (let i = 0; i < construction.images.length; i++) {
      formData.append('images', construction.images.item(i))
    }

    return this._httpClient.post(`${this.baseUrl}/constructions`, formData);
  }

  public confirmConstruction(confirmationToken: string) {
    return this._httpClient.post(`${this.baseUrl}/constructions/confirm`, {confirmationToken})
  }

}
