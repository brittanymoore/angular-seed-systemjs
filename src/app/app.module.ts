import { AppComponent } from './app.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MyTestComponent } from './my-test.component/my-test.component';

@NgModule({
    imports: [
        BrowserModule
    ],
    declarations: [
        AppComponent,
        MyTestComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}