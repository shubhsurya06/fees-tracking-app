import { createReducer, on } from '@ngrx/store';
import { MasterActions } from './actions';
import { IMaster } from '../../core/model/master-model';
import { Master } from '../../pages/master/master';

// export const FeatureKey = '';

export interface IMasterState {
  masters: IMaster[];
  mastersByType: { [key: string]: IMaster[] };
  isLoading: boolean;
}

export const initialState: IMasterState = {
  masters: [],
  mastersByType: {},
  isLoading: false
};

export const MasterReducer = createReducer(
  initialState,

  // load all master data
  on(MasterActions.loadMasters, (state) => ({
    ...state,
    isLoading: true
  })),

  // load all masters data success
  on(MasterActions.loadMastersSuccess, (state, {data}) => ({
    ...state,
    masters: data as IMaster[],
    isLoading: false
  })),

  // load all masters data failure
  on(MasterActions.loadMastersFailure, (state, {error}) => ({
    ...state,
    error: error,
    isLoading: false
  })),

  on(MasterActions.loadMastersByType, (state, { isForMaster }) => ({
    ...state,
    isLoading: true
  })),
  
  // load masters by type success
  on(MasterActions.loadMastersTypeSuccess, (state, {data, isForMaster}) => ({
    ...state,
    mastersByType: {
      ...state.mastersByType,
      [isForMaster]: data as IMaster[]
    },
    isLoading: false
  })),

);

