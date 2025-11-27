import { createFeatureSelector, createSelector } from "@ngrx/store";
import { IMasterState } from "./reducer";

export const selectorMasterState = createFeatureSelector<IMasterState>('master');

export const loadingSelector = createSelector(
  selectorMasterState,
  (state: IMasterState) => state.isLoading
);

export const mastersSelector = createSelector(
  selectorMasterState,
  (state: IMasterState) => state.masters
);

export const mastersByTypeSelector = (masterType: string) => createSelector(
  selectorMasterState,
  (state: IMasterState) => state.mastersByType[masterType] || []
);

