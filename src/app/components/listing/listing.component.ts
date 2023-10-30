import {Component, HostBinding, Input, OnInit} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {JsonPipe, NgForOf, NgIf} from "@angular/common";
import {variationInterface} from "../../models/variations.interface";

@Component({
    selector: 'app-listing',
    templateUrl: './listing.component.html',
    styleUrls: ['./listing.component.css'],
    imports: [
        FormsModule,
        NgForOf,
        JsonPipe,
        NgIf
    ],
    standalone: true
})

export class ListingComponent implements OnInit {
    @HostBinding('class.container')
    protected readonly hbClass = true;

    @Input() maxOptions = 3;

    variationTitle: string = '';
    variations: variationInterface[] = localStorage.getItem('variations') ? JSON.parse(localStorage.getItem('variations') || '') : []
    tableData: any[] = [];

    ngOnInit() {
        this.updateVariations();
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
    }

    addVariation(event?: Event) {
        if(event) {
            event.preventDefault();
        }
        if(this.variationTitle !== '') {
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
    }

    updateVariations() {
        localStorage.setItem('variations', JSON.stringify(this.variations));
        this.tableData = [];
        this.generateTableData(0, []);
    }

    addOption(variation: variationInterface, event?: Event) {
        if(event) {
            event.preventDefault();
        }
        if(variation.option !== '') {
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
        this.updateVariations();
    }
}
