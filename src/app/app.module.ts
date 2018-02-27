import { LoadingController } from 'ionic-angular';
import { NgModule, ErrorHandler } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  CommonModule, LocationStrategy,
  HashLocationStrategy/*, PathLocationStrategy*/
} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http, XHRBackend, RequestOptions } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler, Platform } from 'ionic-angular';

import { MyApp } from './app.component';

import { ChartsModule } from 'ng2-charts';

import { environment } from '../environments/environment';

import { AngularFireModule, FirebaseAppConfig } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth, AngularFireAuthModule } from 'angularfire2/auth';
import { FirebaseAuthService } from './shared/services/firebase-auth.service';

import { OidcAuthService } from './shared/services/auth.service';
import { AuthGuardService } from './shared/services/auth-guard.service';

// Routing Module
import { AppRoutingModule } from './app.routing';

import { LayoutModule } from './layout/layout.module';
import { Network } from '@ionic-native/network';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MenuItemComponent } from './shared/components/menu-item/menu-item.component';
import { AUTH_SERVICE } from './shared/services/base-auth.service';
import { httpFactory } from './shared/services/intercepted-http.service';
import { YoloOidcAuthService } from './shared/services/yolo-auth.service';


function isCordova(platform?: Platform): boolean {
  try {
    const isCordovaVar = !!((<any>window).cordova);
    let isDesktop = false;
    if (platform != null) {
      isDesktop = platform.is('core');
    }
    return isCordovaVar && (!isDesktop);
  } catch (e) { return false; }
}

export function authFactory(platform: Platform, yoloAuth: YoloOidcAuthService, oidcAuth: OidcAuthService) {
  const isCordovaVar = isCordova(platform);
  if (isCordovaVar != null && isCordovaVar && platform.is('mobileweb') === false) {
    return oidcAuth;
  } else {
    return yoloAuth;
  }
}


@NgModule({
  declarations: [
    MyApp,
    MenuItemComponent
  ],
  imports: [
    HttpModule,
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    AppRoutingModule,

    ChartsModule,

    IonicModule.forRoot(MyApp),

    // AngularFireModule.initializeApp(environment.firebase), //Keep this if you use Firebase, otherwise comment/remove it
    // AngularFireDatabaseModule, //Keep this if you use Firebase, otherwise comment/remove it
    // AngularFireAuthModule, //Keep this if you use Firebase, otherwise comment/remove it

    LayoutModule,

    environment.production ? ServiceWorkerModule.register('./ngsw-worker.js') : []
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy // This strategy with base-href './' allow to move the app to any subsite and works
      // useClass: PathLocationStrategy // Only if passed the --base-href argument at build & the server has url rewrite to index.html
    },

    Network,
    StatusBar,
    SplashScreen,

    OidcAuthService,
    YoloOidcAuthService,

    {
      provide: AUTH_SERVICE,
      useFactory: authFactory,
      deps: [Platform, YoloOidcAuthService, OidcAuthService ]
    }, // Dynamically choose between Yolo on web and Oidc on Hybrid
    // { provide: AUTH_SERVICE, useClass: YoloOidcAuthService, deps: [OidcAuthService] },
    // If want to use Credential Management (YOLO) falling back to OidcAuthService
    // { provide: AUTH_SERVICE, useClass: OidcAuthService }, // If want to use an OpenID/OAuth2 Auth Provider (generically)
    // { provide: AUTH_SERVICE, useClass: FirebaseAuthService }, //If want to use Firebase as an Auth Provider

    // AngularFireAuth, AngularFireDatabase, //Keep this if you use Firebase, otherwise comment/remove it

    {
      provide: Http,
      useFactory: httpFactory,
      deps: [XHRBackend, RequestOptions, AUTH_SERVICE, LoadingController]
    },

    AuthGuardService,


    // YoloAuthService
  ]
})
export class AppModule { }
