import { NgZone, OnInit } from '@angular/core';
import { controlledTimer } from '../models/interfaces/controlledTimer';
import {
  InitDelayTimers,
  InitDelayTimersTest,
  initDelayTimers,
} from './element-visibility';
import {
  AddElementControlsSubscription,
  AddElementControlsSubscriptionTest,
  ElementDestinationDetails,
  addElementControlsSubscriptions,
  goToPreviousElement,
} from './element-controls';
import { Subscription } from 'rxjs';
import { ElementControlsService } from './element-controls.service';
import { Arrows } from './toast/models/arrows';
import { Position } from './toast/models/position';

export class TestInterfaces implements AddElementControlsSubscriptionTest {
  constructor() {
    console.log('in constructor');
  }

  [x: string]: any;
  // addElementControlsSubscriptions(thisOfResidingClass: AddElementControlsSubscription): void {
  //   throw new Error('Method not implemented.');
  // }
  // elementId: string;
  // elementGroupId: string | undefined;
  // subscriptions: Subscription[];
  // nextElements?: { id: string; position: Position; effectivePosition: 'absolute' | 'fixed'; arrows?: Arrows | undefined; }[] | undefined;
  // elementDestinations: ElementDestinationDetails[];
  // currentNextElementIndex: number;
  // defineNextElement: () => void;
  // showOnInitDelayTimer?: controlledTimer | undefined;
  // hideOnInitDelayTimer?: controlledTimer | undefined;
  // hideDelayTimer?: controlledTimer | undefined;
  // display: 'inline-block' | 'none';
  // isShowing: boolean;
  // keepShowing: boolean;

  // elementControlsService: ElementControlsService;

  myMethod(): void {
    console.log('hey');
    addElementControlsSubscriptions(this);

    goToPreviousElement(this);
  }
}
