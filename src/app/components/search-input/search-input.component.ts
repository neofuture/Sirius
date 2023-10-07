import {Component, HostBinding} from "@angular/core";
import {ActivatedRoute, Params} from "@angular/router";
import {Subscription} from "rxjs";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {CurrencyPipe, NgForOf, NgIf} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {LoadingComponent} from "../loading/loading.component";
import {environment} from "../../../environments/environment";
import {categories} from "../../dynamic-routes.routes";

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.css'],
  standalone: true,
  imports: [
    CurrencyPipe,
    LoadingComponent,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
  ]
})
export class SearchInputComponent {
  @HostBinding('class.search-bar')
  protected readonly hbClass = true;

  categories = categories;
  inputFocus: boolean = false;
  searchText: string = '';
  searchDeBounce: any;
  timer1: any;
  timer2: any;
  listings: any = [];
  searchLoading = false;
  searchingText = 'Searching';
  searchCompleted = false;
  category: string = '';
  selectedCategory: number = 0;
  private params: Params;
  private searchObs: Subscription | undefined;
  private searchValue: string = '';

  constructor(
    private httpClient: HttpClient,
    private activatedRoute: ActivatedRoute
  ) {
    this.params = this.activatedRoute.snapshot.queryParams;
    if (this.params["search"]) {
      this.searchText = this.params["search"];
    }
    if (this.params["cat_id"]) {
      this.selectedCategory = parseInt(this.params["cat_id"]);
    }
  }

  setFocus() {
    this.inputFocus = true;
    this.searchLoading = false;
  }

  setBlur() {
    this.inputFocus = false;
  }

  search(event: any) {
    this.searchValue = event.target.value;

    if (event.key === 'Escape') {
      this.listings = [];
      this.searchText = '';
      event.target.blur();
    }

    if (event.key === 'Enter') {
      this.listings = [];
      let categoryName = '';
      for (const category of categories) {
        if (category.value === parseInt(String(this.selectedCategory), 10)) {
          categoryName = category.label;
        }
      }
      const url = `/search/?search=${event.target.value}&page=1&cat_id=${this.selectedCategory}&category=${categoryName}`;
      window.location.href = url;
      this.searchObs?.unsubscribe();
    } else {
      this.runSearch();
    }
  }

  runSearch() {
    clearTimeout(this.searchDeBounce);
    clearTimeout(this.timer1);
    clearTimeout(this.timer2);
    this.searchDeBounce = setTimeout(() => {

      this.searchLoading = true;
      this.listings = [];
      this.searchingText = 'Searching';
      this.timer1 = setTimeout(() => {
        this.searchingText = 'Still searching';
      }, 3000);
      this.timer2 = setTimeout(() => {
        this.searchingText = 'Please wait. Still searching';
      }, 8000);
      if (this.searchValue.length > 2) {
        this.searchLoading = true;
        let categoryName = '';
        for (const category of categories) {
          if (category.value === parseInt(String(this.selectedCategory), 10)) {
            categoryName = category.label;
          }
        }
        this.searchObs = this.httpClient.get(
          `${environment.api}/search?search=${this.searchValue}${this.selectedCategory !== 0 ? `&cat_id=${this.selectedCategory}&category=${categoryName}` : ''}`
        ).subscribe((data: any) => {
          this.listings = data.data.listings;
          this.searchLoading = false;
          this.searchCompleted = true;
        });
      } else {
        this.listings = [];
        this.searchLoading = false;
      }
    }, 500);
  }

  selectListing(listing: any) {
    this.listings = [];
    const listing_title = listing.listing_title.replace(/ /g, '-').replace(/%/g, '').replace(/(\(|\))/g, '');
    const url = `/item/${listing.listing_id}/${listing_title}`;
    window.location.href = url;
  }

  changeCategory() {
    this.listings = [];
    this.runSearch();
  }
}
