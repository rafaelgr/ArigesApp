import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Geolocation } from '@ionic-native/geolocation';

import { MyApp } from './app.component';
import { LocalDataProvider } from '../providers/local-data/local-data';
import { ArigesDataProvider } from '../providers/ariges-data/ariges-data';
import { InterDataProvider } from '../providers/inter-data/inter-data';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { AppVersion } from '@ionic-native/app-version';
import { Clipboard } from '@ionic-native/clipboard/ngx';






@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    AppVersion,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    LocalDataProvider,
    ArigesDataProvider,
    InterDataProvider,
    ScreenOrientation,
    Clipboard
  
  ]
})
export class AppModule {}
