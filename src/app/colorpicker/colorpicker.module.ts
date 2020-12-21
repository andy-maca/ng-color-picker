import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorPaletteComponent } from './color-palette/color-palette.component';
import { ColorSliderComponent } from './color-slider/color-slider.component';
import { ColorPickerComponent } from './color-picker/color-picker.component';
import { ColorPipe } from './color.pipe';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ColorPaletteComponent,
    ColorSliderComponent,
    ColorPickerComponent,
    ColorPipe
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    ColorPaletteComponent,
    ColorSliderComponent,
    ColorPickerComponent,
    ColorPipe
  ]
})
export class ColorPickerModule { }
