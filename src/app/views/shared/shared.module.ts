import { NgModule } from '@angular/core';
import {CustomeTimePipePipe} from './custometime-pipe.pipe';
import { CustomeTimeAmPmPipe } from './custometimeampm.pipe';
import { TruncatePipe } from './truncate.directive';
//import { AppRoutingModule } from '../app-routing.module';

@NgModule({
  declarations: [
    CustomeTimePipePipe,
    CustomeTimeAmPmPipe,
    TruncatePipe
  ],
  imports: [

  ],
  exports :[
    CustomeTimePipePipe,
    CustomeTimeAmPmPipe,
    TruncatePipe,
  ]
})
export class SharedModule { }
