# How to set up 

1. Change environment.ts file with right credentials
2. open cmd and open Chrome Browser with disabled security. `chrome.exe --user-data-dir="C://Chrome dev session" --disable-web-security`
   this is required because there is no CORS configured on the server side and without it you will not be able to get the data
3. Install all required libraries
4. build and run dev server via `ng serve`
5. In Browser open `http://localhost:4200/`

# Crypto

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.7.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
