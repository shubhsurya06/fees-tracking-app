import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { IMaster } from '../../core/model/master-model';

export const MasterActions = createActionGroup({
  source: 'Master',
  events: {
    'LoadMasters': emptyProps(),
    'LoadMasters Success': props<{ data: IMaster[] }>(),
    'LoadMasters Failure': props<{ error: any }>(),

    'LoadMasters By Type': props<{ isForMaster: string }>(),
    'LoadMasters Type Success': props<{ data: IMaster[], isForMaster: string }>(),
    'Load Masters Type Failure': props<{ error: any }>(),

    'Reset Master State': emptyProps()
  }
});
