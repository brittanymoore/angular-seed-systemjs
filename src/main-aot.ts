import 'core-js/es7/reflect';
import 'zone.js/dist/zone';

import { platformBrowser } from '@angular/platform-browser';
import { AppModuleNgFactory } from './../aot/src/app/app.module.ngfactory';

import { enableProdMode } from '@angular/core';

enableProdMode();
platformBrowser().bootstrapModuleFactory(AppModuleNgFactory);
