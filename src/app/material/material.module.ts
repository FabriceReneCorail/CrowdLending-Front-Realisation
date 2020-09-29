import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';

import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import {MatRadioModule} from '@angular/material/radio';


// import {MatCheckboxModule} from '@angular/material/checkbox';
// import {MatSelectModule} from '@angular/material/select';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule
  ],
  exports: [MatButtonModule, MatFormFieldModule, MatInputModule, MatCardModule, MatDatepickerModule, MatNativeDateModule]
})
export class MaterialModule {}
