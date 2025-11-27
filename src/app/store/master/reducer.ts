import { createReducer, on } from '@ngrx/store';
import { MasterActions } from './actions';
import { IMaster } from '../../core/model/master-model';
import { Master } from '../../pages/master/master';

// export const FeatureKey = '';

export interface IMasterState {
  masters: IMaster[];
  mastersByType: { [key: string]: IMaster[] };
  isLoading: boolean;
  error?: any;
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

  on(MasterActions.loadMastersByType, (state) => ({
    ...state,
    isLoading: true
  })),
  
  // load masters by type success
  on(MasterActions.loadMastersTypeSuccess, (state, {data, isForMaster}) => {
    console.log('Before state update', state);  // Log state before updating
    console.log('Loaded Data:', data);          // Log the data being passed in
    console.log('isForMaster:', isForMaster);    // Log the value of isForMaster

    return {
      ...state,
      mastersByType: {
        ...state.mastersByType,
        [isForMaster]: data as IMaster[]
      },
      isLoading: false
    }
  }),

  on(MasterActions.resetMasterState, (state) => {
    console.log('Master state before reset:', state);
    console.log('Master initial state:', initialState);
    return initialState;
  })


);

