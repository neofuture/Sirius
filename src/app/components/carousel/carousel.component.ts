import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  HostBinding,
  Input,
  ViewChild
} from "@angular/core";
import {register, SwiperContainer} from 'swiper/element/bundle';
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css'],
  standalone: true,
  imports: [
    NgForOf,
    NgIf
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class CarouselComponent implements AfterViewInit {
  @HostBinding('class.carousel')
  protected readonly hbClass = true;
  activeSlide: number = 0;
  @Input() slidesPerView: number = 1;
  @Input() autoplayDelay: any = false;
  @Input() autoplay: any = false;
  @Input() pagination: boolean = false;
  @Input() nextButton: string = 'Next';
  @Input() prevButton: string = 'Previous';
  @Input() slides: any = [];

  @ViewChild('swiperContainer', {static: false}) swiperContainer?: ElementRef<SwiperContainer>;

  constructor() {
    register();
  }


  setActiveSlide(index: number) {
    this.swiperContainer?.nativeElement.swiper.slideTo(index);
  }

  setNextSlide() {
    this.swiperContainer?.nativeElement.swiper.slideNext();
  }

  setPreviousSlide() {
    this.swiperContainer?.nativeElement.swiper.slidePrev();
  }

  ngAfterViewInit(): void {
    if (this.swiperContainer?.nativeElement.swiper) {
      this.swiperContainer.nativeElement.swiper.on('slideChange', () => {
        if (this.swiperContainer?.nativeElement.swiper.activeIndex !== undefined) {
          this.activeSlide = this.swiperContainer?.nativeElement.swiper.activeIndex;
        }
      });
      if(this.autoplay){
        this.swiperContainer.nativeElement.swiper.autoplay.start();
      }
    }
  }
}
