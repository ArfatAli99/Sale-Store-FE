import { Component, OnDestroy, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { navItems } from '../../_nav';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth.service';
import { Location } from '@angular/common';
import { BroadcasterService } from '../../broadcaster.service';
import { environment } from '../../../environments/environment';
import { MenuService } from '../../_services/menu.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  encapsulation: ViewEncapsulation.None
})
export class DefaultLayoutComponent implements OnInit, OnDestroy {
  public navItems = navItems;
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement;
  public invokeProfileImage: any;
  profileImage: string = localStorage.getItem('profile_image');
  imageSubscribe: any;
  name: string;
  menu: Array<any> = [];
  breadcrumbList: Array<any> = [];
  breadcumSubscription:any;
  base_url:string = environment.base_url;

  /**
   * Creates an instance.
   * input: @param router
   * @param auth
   * @param location
   * @param broadcasterService 
   * @param activatedRoute
   * @param menuService
   * created by : Biswajit
   */
  constructor(
    private router: Router,
    public auth: AuthService,
    private location: Location,
    private broadcasterService: BroadcasterService,
    private activatedRoute: ActivatedRoute,
    private menuService: MenuService,
    @Inject(DOCUMENT) _document?: any) {
    this.changes = new MutationObserver((mutations) => {
      this.breadcumListingRouting();
      this.sidebarMinimized = _document.body.classList.contains('sidebar-minimized');
    });
    this.element = _document.body;
    this.changes.observe(<Element>this.element, {
      attributes: true,
      attributeFilter: ['class']
    });
  }

/**
   * ngOnInit
   * method: life cycle hook
   * purpose: initialize
   * created by Biswajit
   */
  ngOnInit() {
    // CAST BROADCAST SERVICE SUBSCRIPTION 
    this.imageSubscribe = this.broadcasterService.cast.subscribe(profileImage => this.profileImage = profileImage);
  }

  /**
   * on destroy
   * created by Biswajit
   */
  ngOnDestroy(): void {
    this.changes.disconnect();
    // CAST BROADCAST SERVICE UNSUBSCRIPTION 
    if (this.imageSubscribe) {      
      this.imageSubscribe.unsubscribe();
    }
    if (this.breadcumSubscription) {      
      this.breadcumSubscription.unsubscribe();
    }
  }

  /**
   * Breadcums listing routing
   * craeted by Biswajit
   */
  breadcumListingRouting() {
    let routerUrl: string, routerList: Array<any>, target: any;
    this.getRouterLinkForBreadCum(this.router.url,this.router);
    this.breadcumSubscription = this.router.events.subscribe((router: any) => {
      routerUrl = router.urlAfterRedirects;
      this.getRouterLinkForBreadCum(routerUrl,router);
    });
  }

  /**
   * Gets router link for bread cum
   * @param routerUrl 
   * @param router 
   * created by Biswajit
   */
  getRouterLinkForBreadCum(routerUrl,router){
    this.menu = this.menuService.getMenu();
    // console.log("MENU = ",this.menu);
    if (routerUrl && typeof routerUrl === 'string') {
      this.breadcrumbList.length = 0;
      // routerList = routerUrl.slice(1).split('/');
      for (let i = 0; i < this.menu.length; i++) {
        if (router.url.includes(this.menu[i].path)) {
          let pagePath = this.menu[i].path;
          
          if (pagePath === '/pages/edit') {
            pagePath = '/pages/edit/our-story';
          }

          this.breadcrumbList.push({
            name: this.menu[i].name,
            path: pagePath
          });
        }
      }
      
      // if (router.url.includes('package-type')) {
      //   this.breadcrumbList.splice(this.breadcrumbList.length - 1, 1);
      // } else if(router.url.includes('/booking/servicelist/4')){
      //   this.breadcrumbList.splice(0, 1);
      // }
      if(!router.url.includes('users')){
        this.breadcrumbList.unshift({ 
          name: 'Home',
          path: '/users'
        });
      }
      // if(localStorage.getItem('bookingPath')){
      //   this.breadcrumbList.splice(1, 0, { 
      //     name: localStorage.getItem('bookingTypeName'),
      //     path: localStorage.getItem('bookingPath')
      //   });
      // }
    }
  }

  /**
   * Logouts default layout component
   * purpose to navigate back to login after logout
   * created by Biswajit
   */
  logout() {
    localStorage.clear();
    this.router.navigate(["/login"], { replaceUrl: true });
  }
}
