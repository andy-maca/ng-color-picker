# ColorPicker

A color picker like QColorDialog in Qt, works the same except the 'Pick Screen Color' is missing, because this function is limited in browser.
- The implementation refers to QColorDialog in https://code.woboq.org/qt5/qtbase/src/widgets/dialogs/qcolordialog.cpp.html
- `hsv2rgb` and `rgb2hsv` refers to QColor in https://code.woboq.org/qt5/qtbase/src/gui/painting/qcolor.cpp.html

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.2.0.

## Code scaffolding

Run `ng generate component component-name --project color-picker` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module --project color-picker`.
> Note: Don't forget to add `--project color-picker` or else it will be added to the default project in your `angular.json` file. 

## Build

Run `ng build color-picker` to build the project. The build artifacts will be stored in the `dist/` directory.

## Publishing

After building your library with `ng build color-picker`, go to the dist folder `cd dist/color-picker` and run `npm publish`.

## Running unit tests

Run `ng test color-picker` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
