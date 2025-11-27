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

// SELECTOR for checking entire cache in effects
export const allMastersByTypeSelector = createSelector(
  selectorMasterState,
  (state: IMasterState) => state.mastersByType
);

// SELECTOR for component usage
export const mastersByTypeSelector = (masterType: string) => createSelector(
  selectorMasterState,
  (state: IMasterState) => state.mastersByType[masterType] || []
);

