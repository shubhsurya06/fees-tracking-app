import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MasterActions } from './actions';
import { MasterService } from '../../core/services/master/master-service';
import { map, switchMap, mergeMap, withLatestFrom, EMPTY, of, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { allMastersByTypeSelector } from './selector';
import { AuthActions } from '../auth/actions';

@Injectable()
export class MasterEffects {
  masterService = inject(MasterService);
  actions$ = inject(Actions);
  masterStore = inject(Store);

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
      withLatestFrom(this.masterStore.select(allMastersByTypeSelector)),
      tap((data: any) => console.log('loading effect tap data:', data)),
      mergeMap(([{ isForMaster }, mastersByType]) => {
        console.log('mergeMap data before calling API:', isForMaster, mastersByType);
        const alreadyLoaded = mastersByType?.[isForMaster];

        // 🚫 SKIP API CALL if data already exists
        if (alreadyLoaded && alreadyLoaded.length > 0) {
          console.log(`Skipping API call for '${isForMaster}' — data already exists`, alreadyLoaded);
          return EMPTY;  // prevents further actions
        }

        console.log(`Calling API for '${isForMaster}' — data not exists`);
        // ✅ CALL API IF NOT CACHED
        return this.masterService.getMasterByType(isForMaster).pipe(
          map((res: any) =>
            MasterActions.loadMastersTypeSuccess({
              data: res.data,
              isForMaster
            })
          ))
      })
    )
  )

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      tap((data: any) => console.log('Logout has been called:', data)),
      map(() => MasterActions.resetMasterState())
    )
  );


}
