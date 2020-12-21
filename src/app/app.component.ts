import { Component } from '@angular/core';
import { ColorPaletteComponent } from './colorpicker/color-palette/color-palette.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'ng-color-picker';
  color: string = "rgb(255, 57, 131)";
  sliderColor: string;
  paletteColors = ColorPaletteComponent.COLORS;
}
