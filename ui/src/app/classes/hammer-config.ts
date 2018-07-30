import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';

import * as Hammer from 'hammerjs';

export class HammerConfig extends HammerGestureConfig {
  overrides = <any>{
    'swipe': {velocity: 0.4, threshold: 80},
  }

  buildHammer(element: HTMLElement) {
    return new Hammer(element, {
      inputClass: Hammer.TouchInput,
      touchAction: 'pan-y',
    });
  }
}
