import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ColorPaletteComponent } from "./color-palette/color-palette.component";
import { ColorPickerComponent } from "./color-picker.component";



@NgModule({
  declarations: [ColorPaletteComponent, ColorPickerComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [ColorPickerComponent, ColorPickerComponent]
})
export class ColorPickerModule { }
