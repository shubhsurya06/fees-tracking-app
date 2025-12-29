import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, computed, inject, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { InstituteService } from '../../../core/services/institute/institute-service';
import { IInstituteModel } from '../../../core/model/institute-model';
import { DatePipe, NgClass, NgStyle } from '@angular/common';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { IPagination } from '../../../core/model/pagination-model';
import { FormsModule } from '@angular/forms';
import { APP_CONSTANT } from '../../../core/constant/appConstant';
import { CommonService } from '../../../core/services/common/common-service';

@Component({
  selector: 'app-institute-list',
  imports: [DatePipe, FormsModule, NgClass, NgStyle],
  templateUrl: './institute-list.html',
  styleUrl: './institute-list.scss'
})
export class InstituteList implements OnInit, AfterViewInit {

  router = inject(Router);
  route = inject(ActivatedRoute);
  instituteService = inject(InstituteService);
  instituteList = signal<IInstituteModel[]>([]);
  isInstituteLoader = signal<boolean>(false);

  searchText: string = '';
  searchSubject = new Subject<string>();
  subscription!: Subscription;
  filteredSearchText = signal<string>('');

  isShowCardView = signal<boolean>(false);
  commonService = inject(CommonService);

  @ViewChild('topCardHeader') topCardHeader!: ElementRef;
  @ViewChild('paginationContainer') paginationContainer!: ElementRef;

  // pagination data
  pagination: IPagination = {
    totalRecords: 0,
    totalPages: 0,
    pageNumbers: []
  };
  currentPageNo = signal<number>(1);

  filteredInstituteList = computed(() => {
    let searchText = this.filteredSearchText().toLowerCase();
    let endIndex = APP_CONSTANT.PAGE_SIZE * this.currentPageNo();

    return this.instituteList().slice(0, endIndex).filter(institute => {
      return institute.name.toLowerCase().includes(searchText);
    });
  });

  constructor() {
  }

  ngOnInit(): void {
    this.subscription = this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe({
      next: (search) => {
        this.filteredSearchText.set(search);
      }
    })

    this.getAllInstitutes();
  }

  ngAfterViewInit(): void {
    APP_CONSTANT.SCREEN_HEIGHTS.INSIDE_HEADER_HEIGHT = this.topCardHeader.nativeElement.offsetHeight;
    APP_CONSTANT.SCREEN_HEIGHTS.PAGINATION_HEIGHT = this.paginationContainer.nativeElement.offsetHeight;
    this.commonService.constantHeights.set(APP_CONSTANT.SCREEN_HEIGHTS);
  }

  /**
   * get height of listViewPost by calculating navbar height, top-header which is above data-list and pagination height
   */
  get heights() {
    return this.commonService.currentViewportHeight(40);
  }

  onSearch() {
    this.searchSubject.next(this.searchText);
  }

  /**
   * Initial pageNo is 1
   * Add paginationin get list
   * @param page 
   */
  goToPage(page: number) {
    if (page > 0 && page <= this.pagination.totalPages) {
      this.currentPageNo.set(page);
    }
  }

  // toggle between card and table view
  toggleView(flag: boolean) {
    this.isShowCardView.set(flag);
  }

  // navigate to add/edit institute form
  addEditInstitute(id: number | string | undefined) {
    id = id && id.toString();
    this.router.navigate(['/institute/form', id]);
  }

  onGetInstituteListSuccess(list: IInstituteModel[]) {
    this.instituteList.set(list);
    this.pagination = this.commonService.setPaginationData(list.length);
    this.goToPage(this.currentPageNo());
  }

  // get all institutes from service
  getAllInstitutes() {
    this.isInstituteLoader.set(true);
    this.instituteService.getAllInstitutes().subscribe({
      next: (res: any) => {
        this.isInstituteLoader.set(false);
        this.onGetInstituteListSuccess(res.data.splice(1));
        // this.instituteList.set(res.data.splice(1));
      },
      error: (error) => {
        this.isInstituteLoader.set(false);
        alert(error.message);
      }
    })
  }

  // delete institute by id
  deleteInstitute(id: number | undefined) {
    console.log('Delete institute with ID:', id);
    this.instituteService.deleteInstitute(id).subscribe({
      next: (res: any) => {
        let updatedList = this.instituteList().filter(institute => institute.instituteId !== id);
        this.onGetInstituteListSuccess(updatedList);
        // this.instituteList.set(updatedList);
      },
      error: (error: any) => {
        alert(error.message);
      }
    })
  }
}
