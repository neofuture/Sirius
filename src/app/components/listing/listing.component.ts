import {Component, ElementRef, HostBinding, Input, OnInit, ViewChild} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {DecimalPipe, JsonPipe, NgForOf, NgIf} from "@angular/common";
import {variationInterface} from "../../models/variations.interface";
import {DecimalValidatorDirective} from "../../directives/decimalValidator.directive";
import {EanValidatorDirective} from "../../directives/eanValidator.directive";
import {ToastService} from "../../services/toast.service";

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
    EanValidatorDirective
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

  tableData: any[] = [];
  sku: string = 'SKU001';
  notation: string = '-';
  basePrice: number = 19.99;
  characters = 2;
  capitalise: string = "uppercase";

  @ViewChild('rootElement', {static: false}) rootElement: ElementRef | undefined;
  baseSkus: any;

  constructor(
    private toastService: ToastService,
  ) {

  }

  ngOnInit() {
    this.updateVariations();
    this.checkMatrixForErrors();
    // const toastConfig = {
    //   title: 'Testing',
    //   body: ['Testing this stuff out'],
    //   autoClose: 5000,
    //   type: 'success'
    // };
    // this.toastService.newToast(toastConfig);
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
      this.baseSkus.push(this.sku + this.notation + this.createSku(this.tableData[i]));
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
  }

  removeOption(variation: variationInterface, i: number) {
    this.variations = this.variations.map((v) => {
      if (v === variation) {
        v.options = v.options.filter((o, j) => j !== i);
      }
      return v;
    });
    this.updateVariations();
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

    if (element === 'ean' && $event.target.value == '') {
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
      sku.push(row[key].substring(0, this.characters));
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
      if (this.matrix[key].sku === sku) {
        count++;
      }
    }

    for (const item of this.baseSkus) {
      if (item === sku) {
        count++;
      }
    }

    return count > 1;
  }

  setVariationOption($event: FocusEvent, variation: variationInterface, i: number) {
    variation.options[i] = ($event.target as HTMLInputElement).value;
    this.updateVariations();
  }

  setVariation($event: FocusEvent, variation: variationInterface) {
    variation.title = ($event.target as HTMLInputElement).value;
    this.updateVariations();
  }

  checkMatrixForErrors() {

    let skus = [];
    for (const key of Object.keys(this.matrix)) {
      skus.push(this.matrix[key].sku);
    }

    for (const item of this.baseSkus) {
      skus.push(item);
    }

    let duplicates = [];
    let unique = skus.filter((v, i, a) => a.indexOf(v) === i);
    for (const sku of unique) {
      if (skus.filter((s) => s === sku).length > 1 && sku !== undefined && typeof sku !== undefined && sku !== '') {
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
  }

  resetItem(element: string, row: string | number) {
    if (element === 'price') {
      if (this.matrix[row] && this.matrix[row].price) {
        delete this.matrix[row].price;
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
  }
}
