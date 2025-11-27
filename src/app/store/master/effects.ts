import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MasterActions } from './actions';
import { MasterService } from '../../core/services/master/master-service';
import { map, switchMap, mergeMap } from 'rxjs';


@Injectable()
export class MasterEffects {
  masterService = inject(MasterService);
  actions$ = inject(Actions);

  loadMasterEffects = createEffect(() =>
    this.actions$.pipe(
      ofType(MasterActions.loadMasters),
      switchMap(() =>
        this.masterService.getAllMasters().pipe(
          map((res: any) => {
            return MasterActions.loadMastersSuccess({ data: res.data })
          })
        )
      )
    )
  )

  loadMasterTypeEffects = createEffect(() =>
    this.actions$.pipe(
      ofType(MasterActions.loadMastersByType),
      mergeMap(({ isForMaster }) =>
        this.masterService.getMasterByType(isForMaster).pipe(
          map((res: any) => {
            return MasterActions.loadMastersTypeSuccess({ data: res.data, isForMaster })
          })
        )
      )
    )
  )


}
