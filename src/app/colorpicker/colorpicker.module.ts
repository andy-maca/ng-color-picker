import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorPaletteComponent } from './color-palette/color-palette.component';
import { ColorPickerComponent } from './color-picker/color-picker.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ColorPaletteComponent,
    ColorPickerComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    ColorPaletteComponent,
    ColorPickerComponent
  ]
})
export class ColorPickerModule { }
