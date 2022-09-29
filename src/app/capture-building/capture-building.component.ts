import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ApiService} from "../services/api-service";
import {catchError, finalize, of} from "rxjs";
import {categories} from "../../models/Category";

@Component({
  selector: 'app-capture-building',
  templateUrl: './capture-building.component.html',
  styleUrls: ['./capture-building.component.scss']
})
export class CaptureBuildingComponent implements OnInit {
  form: FormGroup;
  sendingForm: boolean;
  hasError: boolean;
  categories = categories;

  constructor(private _form: FormBuilder, private _apiService: ApiService) {
    this.form = this._form.group({
      city: ['', [Validators.required]],
      structure: ['', [Validators.required]],
      images: [],
      architecture: ['', [Validators.required]],
      constructionYear: null,
      longitude: [null, [Validators.required]],
      latitude: [null, [Validators.required]],
      description: '',
      phone: '',
      email: ['', [Validators.required]],
      link: '',
      fullName: '',
      category: ['', [Validators.required]]
    })
  }

  ngOnInit(): void {
  }

  sendForm() {
    console.log(this.form.value);
    this.sendingForm = true;
    this._apiService.postConstruction(this.form.value).pipe(finalize(() => this.sendingForm = false)).pipe(catchError(error => {
      this.hasError = true;
      this.sendingForm = false;
      return of(error)
    }));
  }

}
