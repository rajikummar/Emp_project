import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Import FormsModule

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { JobdemplyoeeComponent } from './jobdemplyoee/jobdemplyoee.component';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@NgModule({
  declarations: [
    AppComponent,
    JobdemplyoeeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatIconModule,
    HttpClientModule,
    MatFormFieldModule,
    FormsModule, // Include FormsModule here
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
