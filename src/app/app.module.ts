import { BrowserModule } from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
// import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { rootRouterConfig } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';  
import {MatButtonModule} from '@angular/material/button'; 
import { MatSelectModule } from '@angular/material/select';  
import {MatIconModule} from '@angular/material/icon';
import {SharedModule} from './shared/shared.module'
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {CustomLocationStrategy} from '../app/custom-location-strategy'
import { LocationStrategy} from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { StarRatingModule } from 'angular-star-rating';
// import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { AgmCoreModule, AgmMap, AgmMarker } from '@agm/core';

@NgModule({
  declarations: [
    AppComponent
    
  ],
  imports: [
    BrowserModule,
    // AppRoutingModule,
    HttpClientModule,
    NgbModule,
    BrowserAnimationsModule, 
    MatButtonModule, 
    MatSelectModule,
    MatIconModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    // OwlDateTimeModule, 
    // OwlNativeDateTimeModule,
    ToastrModule.forRoot(),
    StarRatingModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBcGudZMXCMmd9uHo-WXYrBGplcWvCNOZU'
    }),
    RouterModule.forRoot(rootRouterConfig, { useHash: false,  scrollPositionRestoration: 'enabled', scrollOffset: [0, 0],
    anchorScrolling: 'enabled',})
  ],
  providers: [{provide: LocationStrategy, useClass: CustomLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
