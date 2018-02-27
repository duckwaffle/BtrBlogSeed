import { LeftMenuService, RightMenuService } from './../../shared/services/menu.service';
import { UserinfoComponent } from './userinfo/userinfo.component';
import { InfoComponent } from './info/info.component';
import { PopoverController, Platform, MenuController } from 'ionic-angular';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Input,
  AfterContentInit,
  ApplicationRef,
  NgZone,
  ChangeDetectionStrategy,
  Inject } from '@angular/core';
import { AUTH_SERVICE, BaseAuthService } from '../../shared/services/base-auth.service';


@Component({
  moduleId: module.id,
  selector: 'seed-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  @Input() public infoAtRightMenu? = false;

  @Input() public showLeftMenuButton? = true;

  @Input() public showRightMenuButton? = true;

  @Input() public showLogin? = true;

  _name: string;

  get name() {
    if (this._name) {
      const splittedName = this._name.split(' ');
      if (splittedName) {
        const initialName = splittedName[0];
        return initialName;
      }else {
        return this._name;
      }
    }else {
      return 'Unidentified';
    }
  }

  ngOnInit(): void {
    this.authService.auth.subscribe(user => {
      this._name = user.identity.user.name;
    });
  }

  constructor(
    public menu: MenuController,
    public leftMenuService: LeftMenuService,
    public rightMenuService: RightMenuService,
    private popoverController: PopoverController,
    @Inject(AUTH_SERVICE) private authService: BaseAuthService<any>) {
  }

  toggleMenu() {
    this.leftMenuService.toggleMenu();
  }

  toggleRightMenu() {
    this.rightMenuService.toggleMenu();
  }

  presentUserInfoPopover(event) {
    this.popoverController.create(UserinfoComponent).present({ ev: event });
  }
  presentInfoPopover(event) {
    this.popoverController.create(InfoComponent).present({ ev: event });
  }

}
