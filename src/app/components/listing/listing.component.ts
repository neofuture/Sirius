import {Component, ElementRef, HostBinding, Input, OnInit, ViewChild} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {DecimalPipe, JsonPipe, NgForOf, NgIf} from "@angular/common";
import {variationInterface} from "../../models/variations.interface";
import {DecimalValidatorDirective} from "../../directives/decimalValidator.directive";
import {EanValidatorDirective} from "../../directives/eanValidator.directive";
import {ToastService} from "../../services/toast.service";
import {SwitchComponent} from "../switch/switch.component";
import {FileManagerComponent} from "../file-manager/file-manager.component";
import {HttpClient, HttpClientModule} from "@angular/common/http";

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css'],
  imports: [
    FormsModule,
    NgForOf,
    JsonPipe,
    NgIf,
    DecimalPipe,
    DecimalValidatorDirective,
    EanValidatorDirective,
    SwitchComponent,
    FileManagerComponent,
    HttpClientModule
  ],
  standalone: true
})

export class ListingComponent implements OnInit {
  @HostBinding('class.container')
  protected readonly hbClass = true;

  @Input() maxOptions = 3;

  variationTitle: string = '';
  variations: variationInterface[] = localStorage.getItem('variations') ? JSON.parse(localStorage.getItem('variations') || '') : []
  matrix: any = localStorage.getItem('matrix') ? JSON.parse(localStorage.getItem('matrix') || '') : {}
  imagePaths: any = localStorage.getItem('imagePaths') ? JSON.parse(localStorage.getItem('imagePaths') || '') : {};
  tableData: any[] = [];
  sku: string = 'SKU001';
  notation: string = '-';
  basePrice: number = 19.99;
  characters = 2;
  capitalise: string = "uppercase";

  @ViewChild('rootElement', {static: false}) rootElement: ElementRef | undefined;

  @ViewChild('pane1', {static: false}) pane1: ElementRef | undefined;
  @ViewChild('pane2', {static: false}) pane2: ElementRef | undefined;
  @ViewChild('pane3', {static: false}) pane3: ElementRef | undefined;
  @ViewChild('pane4', {static: false}) pane4: ElementRef | undefined;
  @ViewChild('pane5', {static: false}) pane5: ElementRef | undefined;
  @ViewChild('pane6', {static: false}) pane6: ElementRef | undefined;
  @ViewChild('pane7', {static: false}) pane7: ElementRef | undefined;
  @ViewChild('pane8', {static: false}) pane8: ElementRef | undefined;

  baseSkus: any;
  activePane: number = 2;
  brand: string = 'Apple';
  model: string = 'iPad Pro 12.9" 2020';
  colour: string = 'Space Grey';
  unbranded: boolean = true;
  ean: string = '56578765654312';
  mpn: string = 'MK1673';
  quantity: number = 1;


  constructor(
    private toastService: ToastService,
    private http: HttpClient
  ) {

  }

  ngOnInit() {
    this.updateVariations();
    this.checkMatrixForErrors();
  }

  generateTableData(variationIndex: number, currentOptions: any[]) {
    if (variationIndex === this.variations.length) {
      this.tableData.push(currentOptions.slice());
      return;
    }
    const variationOptions = this.variations[variationIndex].options;
    for (let i = 0; i < variationOptions.length; i++) {
      currentOptions.push(variationOptions[i]);
      this.generateTableData(variationIndex + 1, currentOptions);
      currentOptions.pop();
    }
    this.generateBaseSkus();
  }

  generateBaseSkus() {
    this.baseSkus = [];
    for (let i = 0; i < this.tableData.length; i++) {
      this.baseSkus.push((this.sku.trim() ? this.sku.trim() + this.notation : '') + this.createSku(this.tableData[i]));
    }
  }

  addVariation(event?: Event) {
    if (event) {
      event.preventDefault();
    }
    if (this.variationTitle !== '') {
      this.variations.push({
        title: this.variationTitle.trim(),
        option: '',
        options: []
      });
      this.variationTitle = '';
      this.updateVariations();
    }
    this.checkMatrixForErrors();
  }

  removeVariation(variation: variationInterface) {
    this.variations = this.variations.filter((v) => v !== variation);
    this.updateVariations();
    this.matrix = {};
  }

  updateVariations() {
    localStorage.setItem('variations', JSON.stringify(this.variations));
    this.tableData = [];
    this.generateTableData(0, []);
  }

  addOption(variation: variationInterface, event?: Event) {
    if (event) {
      event.preventDefault();
    }
    if (variation.option !== '') {
      this.variations = this.variations.map((v) => {
        if (v === variation) {
          v.options.push(v.option.trim());
          v.option = '';
        }
        return v;
      });
      this.updateVariations();
    }
    this.checkMatrixForErrors();
  }

  removeOption(variation: variationInterface, i: number) {
    this.variations = this.variations.map((v) => {
      if (v === variation) {
        v.options = v.options.filter((o, j) => j !== i);
      }
      return v;
    });
    this.updateVariations();
    this.checkMatrixForErrors();
  }

  reset() {
    this.variations = [];
    this.matrix = {};
    this.updateVariations();
  }

  createMatrix(element: string, $event: any, row: any) {
    let reset = false;
    if (element === 'price' && $event.target.value == this.basePrice) {
      if (this.matrix[row] && this.matrix[row].price) {
        delete this.matrix[row].price;
      }
      reset = true;
    }

    if (element === 'quantity' && $event.target.value == this.quantity) {
      if (this.matrix[row] && this.matrix[row].quantity) {
        delete this.matrix[row].quantity;
      }
      reset = true;
    }

    if (element === 'ean' && $event.target.value === this.ean) {
      if (this.matrix[row] && this.matrix[row].ean) {
        delete this.matrix[row].ean;
      }
      reset = true;
    }

    if (element === 'sku' && $event.target.value === this.sku + this.notation + this.createSku(row)) {
      if (this.matrix[row] && this.matrix[row].sku) {
        delete this.matrix[row].sku;
      }
      reset = true;
    }

    if (this.matrix[row] && Object.keys(this.matrix[row]).length === 0) {
      delete this.matrix[row];
      reset = true;
    }

    if (!reset) {
      const obj: any = this.matrix[row] || {}
      obj[element] = $event.target.value;
      this.matrix[row] = obj;
      this.checkMatrixForErrors();
    }
    localStorage.setItem('matrix', JSON.stringify(this.matrix));
  }

  resetMatrixRow(row: any) {
    delete this.matrix[row];
    localStorage.setItem('matrix', JSON.stringify(this.matrix));
  }

  createSku(row: any) {
    let sku = [];
    for (let key in row) {
      sku.push(row[key].substring(0, this.characters).trim());
    }
    if (this.capitalise === "uppercase") {
      sku = sku.map((s) => s.toUpperCase());
    }
    if (this.capitalise === "lowercase") {
      sku = sku.map((s) => s.toLowerCase());
    }
    return sku.join(this.notation);
  }

  matrixDuplication(sku: any) {

    let count = 0;

    for (const key of Object.keys(this.matrix)) {
      if (this.matrix[key].sku && this.matrix[key].sku.toLowerCase() === sku.toLowerCase()) {
        count++;
      }
    }

    for (const item of this.baseSkus) {
      if (item.toLowerCase() === sku.toLowerCase()) {
        count++;
      }
    }

    return count > 1;
  }

  setVariationOption($event: Event, variation: variationInterface, i: number) {
    variation.options[i] = ($event.target as HTMLInputElement).value.trim();
    this.updateVariations();
  }

  setVariation($event: Event, variation: variationInterface) {
    variation.title = ($event.target as HTMLInputElement).value.trim();
    this.updateVariations();
    this.checkMatrixForErrors();
  }

  checkMatrixForErrors() {

    let skus = [];
    for (const key of Object.keys(this.matrix)) {
      if (this.matrix[key].sku) {
        skus.push(this.matrix[key].sku.toLowerCase());
      }
    }

    if (this.baseSkus) {
      for (const item of this.baseSkus) {
        skus.push(item.toLowerCase());
      }
    }


    let duplicates = [];
    let unique = skus.filter((v, i, a) => a.indexOf(v) === i);
    for (const sku of unique) {
      if (skus.filter((s) =>
          s.toLowerCase() === sku.toLowerCase()).length > 1 &&
        sku.toLowerCase() !== undefined &&
        typeof sku.toLowerCase() !== undefined &&
        sku.toLowerCase() !== '') {
        duplicates.push(sku);
      }
    }

    if (duplicates.length > 0) {
      const toastConfig = {
        title: 'Error',
        body: ['The following SKU`s are duplicated.<br><br>' + duplicates.join('<br>')],
        autoClose: 5000,
        type: 'error'
      };
      this.toastService.newToast(toastConfig);
    }

    let variationDuplicates = [];
    const titleSet = new Set();
    for (const item of this.variations) {
      if (titleSet.has(item.title)) {
        variationDuplicates.push(item.title.toLowerCase());
      }
      titleSet.add(item.title.toLowerCase());

      for (const option of item.options) {
        variationDuplicates = [];
        if (this.hasDuplicateOptions(item, option)) {
          variationDuplicates.push(option);
        }
      }
      if (variationDuplicates.length > 0) {
        const toastConfig = {
          title: 'Error',
          body: ['The variation ' + item.title + ' has duplicate options. ' + variationDuplicates.join('<br>') + '<br><br>Please correct your variation options.'],
          autoClose: 5000,
          type: 'error'
        };
        this.toastService.newToast(toastConfig);
      }
    }
    if (variationDuplicates.length > 0) {
      const toastConfig = {
        title: 'Error',
        body: ['The following variation is duplicated. ' + variationDuplicates.join('<br>') + '<br><br>Please correct your variations.'],
        autoClose: 5000,
        type: 'error'
      };
      this.toastService.newToast(toastConfig);
    }

  }

  hasDuplicateTitles(titleToCheck: string) {
    const titleSet = new Set();
    for (const item of this.variations) {
      if (item.title.toLowerCase() === titleToCheck.toLowerCase()) {
        if (titleSet.has(titleToCheck.toLowerCase())) {
          return true;
        }
        titleSet.add(titleToCheck.toLowerCase());
      }
    }
    return false;
  }

  resetItem(element: string, row: string | number) {
    if (element === 'price') {
      if (this.matrix[row] && this.matrix[row].price) {
        delete this.matrix[row].price;
      }
    }

    if (element === 'quantity') {
      if (this.matrix[row] && this.matrix[row].quantity) {
        delete this.matrix[row].quantity;
      }
    }

    if (element === 'ean') {
      if (this.matrix[row] && this.matrix[row].ean) {
        delete this.matrix[row].ean;
      }

    }

    if (element === 'sku') {
      if (this.matrix[row] && this.matrix[row].sku) {
        delete this.matrix[row].sku;
      }
    }

    if (this.matrix[row] && Object.keys(this.matrix[row]).length === 0) {
      delete this.matrix[row];
    }

    localStorage.setItem('matrix', JSON.stringify(this.matrix));
  }

  hasDuplicateOptions(variation: variationInterface, string: string) {
    const optionSet = new Set();
    for (const item of variation.options) {
      if (item.toLowerCase() === string.toLowerCase()) {
        if (optionSet.has(string.toLowerCase())) {
          return true;
        }
        optionSet.add(string.toLowerCase());
      }
    }
    return false;

  }

  setActivePane(event: Event, number: number) {
    if (this.activePane !== number) {
      event.preventDefault();
      event.stopPropagation();
      this.activePane = number;
      setTimeout(() => {
        // @ts-ignore
        const element = document.getElementById('pane' + number).offsetTop - 16;
        window.scroll({top: element, left: 0, behavior: 'smooth'});
      }, 300);      setTimeout(() => {
        // @ts-ignore
        const element = document.getElementById('pane' + number).offsetTop - 16;
        window.scroll({top: element, left: 0, behavior: 'smooth'});
      }, 600);

    }
  }

  setFilename(item: number, filename: string) {
    if (filename === null) {
      delete this.imagePaths[item];
    } else {
      this.imagePaths[item] = filename;
    }
    localStorage.setItem('imagePaths', JSON.stringify(this.imagePaths));
  }

  resetListing() {
    for (const key in this.imagePaths) {
      if (this.imagePaths.hasOwnProperty(key)) {
        this.removeImage(this.imagePaths[key]);
      }
    }

    this.variations = [];
    this.matrix = {};
    this.imagePaths = {};
    this.updateVariations();
    localStorage.removeItem('matrix');
    localStorage.removeItem('imagePaths');
    localStorage.removeItem('variations');
    const toastConfig = {
      title: 'Success',
      body: ['Listing reset successfully'],
      autoClose: 5000,
      type: 'success'
    };
    this.toastService.newToast(toastConfig);

  }

  private removeImage(filename: any) {
    this.http.delete('https://sirius.carlfearby.co.uk/api/v1/listing/image?path=' + filename).subscribe((event: any) => {
      console.log(event);
    });
  }

  hasImagePaths() {
    return Object.keys(this.imagePaths).length > 0;
  }

  createArray(number: number) {
    return Array(number);
  }

  countImages() {
    return Object.keys(this.imagePaths).length;
  }
}
