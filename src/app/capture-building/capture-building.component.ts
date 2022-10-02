import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ApiService} from "../services/api-service";
import {catchError, of} from "rxjs";
import {categories} from "../../models/Category";
import {MatSnackBar} from "@angular/material/snack-bar";

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
  selectedFiles?: FileList;
  previews: string[] = [];

  constructor(private _form: FormBuilder, private _apiService: ApiService, private _snackBar: MatSnackBar) {
    this.form = this._form.group({
      city: ['', [Validators.required]],
      structure: ['', [Validators.required]],
      images: [],
      architecture: ['', [Validators.required]],
      constructionYear: [null, [Validators.required]],
      longitude: [null, [Validators.required, Validators.pattern("^(\\+|-)?(?:180(?:(?:\\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\\.[0-9]{1,6})?))$"),]],
      latitude: [null, [Validators.required, Validators.pattern("^(\\+|-)?(?:90(?:(?:\\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\\.[0-9]{1,6})?))$"),]],
      description: '',
      phone: '',
      email: ['', [Validators.required]],
      link: '',
      fullName: '',
      category: ['', [Validators.required]]
    })
  }

  get longitudeFormControl() {
    return this.form.get('longitude');
  }

  get latitudeFormControl() {
    return this.form.get('latitude');
  }

  ngOnInit(): void {
  }

  sendForm() {
    this.sendingForm = true;
    this._apiService.postConstruction(this.form.value)
      .pipe(catchError(error => {
        this.hasError = true;
        this.sendingForm = false;
        this._snackBar.open(`Fehler: ${error}`, 'Schliessen')
        return of(error)
      })).subscribe(() => {
      this.sendingForm = false;
      this._snackBar.open('Die Angaben werden vom Innerschweizer Heimatschutz geprüft und nach der Validierung hochgeladen', 'Schliessen')
      this.form.reset();
    });
  }

  selectFiles(event: any): void {
    this.selectedFiles = event.target.files;
    this.form.get('images').setValue(this.selectedFiles);

    this.previews = [];
    if (this.selectedFiles && this.selectedFiles[0]) {
      const numberOfFiles = this.selectedFiles.length;
      for (let i = 0; i < numberOfFiles; i++) {
        const reader = new FileReader();

        reader.onload = (e: any) => {
          this.previews.push(e.target.result);
        };

        reader.readAsDataURL(this.selectedFiles[i]);
      }
    }
  }
}
