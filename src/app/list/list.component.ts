import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl} from "@angular/forms";
import {categories, Category} from "../../models/Category";
import {BehaviorSubject, combineLatest, debounceTime, Subject, switchMap, take, takeUntil} from "rxjs";
import {ApiService} from "../services/api-service";
import {MatTableDataSource} from "@angular/material/table";
import {Construction} from "../../models/Construction";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['structure', 'city', 'constructionYear', 'architecture', 'category'];
  categoryFilterControl = new FormControl<Category>({} as Category);
  categories = categories;
  searchControl = new FormControl<string>('');
  enterInSearch$ = new BehaviorSubject<any>(null);
  dataSource: MatTableDataSource<Construction>;
  detailOpened: boolean;
  selectedId$ = new BehaviorSubject<string>('');

  private _unsubscribe$ = new Subject<void>();

  constructor(private _apiService: ApiService) {
    this.dataSource = new MatTableDataSource<Construction>();
    this._apiService.getConstructions().pipe(take(1)).subscribe(constructions => this.dataSource.data = constructions);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this._watchControls();
  }

  ngOnDestroy() {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

  onEnter() {
    this.enterInSearch$.next(this.searchControl.value);
  }

  setSelectedId(construction: Construction) {
    this.detailOpened = true;
    this.selectedId$.next(construction.id);
  }

  private _watchControls() {
    this.categoryFilterControl.valueChanges
      .pipe(
        takeUntil(this._unsubscribe$),
        switchMap(category =>
          this._apiService.getConstructions(this.searchControl.value!, category)
        )
      )
      .subscribe(constructions => {
        this.dataSource.data = constructions
      });

    combineLatest(
      this.searchControl.valueChanges,
      this.enterInSearch$
    )
      .pipe(
        takeUntil(this._unsubscribe$),
        debounceTime(300),
        switchMap(([searchValue, _]) =>
          this._apiService.getConstructions(searchValue!, this.categoryFilterControl.value)
        )).subscribe(constructions => {
      this.dataSource.data = constructions
    });
  }

}
