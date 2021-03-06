import { InjectionToken } from '@angular/core';

import { ListFilterProvider } from './list-filter';

export const LIST_UTILS_MODULE_GROUP_BY_TOKEN = new InjectionToken<ListFilterProvider<unknown>>('ListUtilsModuleGroupByToken');
export const LIST_UTILS_MODULE_SORT_BY_TOKEN = new InjectionToken<ListFilterProvider<unknown>>('ListUtilsModuleSortByToken');
export const LIST_UTILS_MODULE_ORDER_BY_TOKEN = new InjectionToken<ListFilterProvider<unknown>>('ListUtilsModuleOrderByToken');

export const LIST_UTILS_MODULE_STORAGE_PREFIX = new InjectionToken<string>('ListUtilsModuleStoragePrefix');
export const LIST_UTILS_MODULE_FUSE_KEYS = new InjectionToken<string[]>('ListUtilsModuleFuseKeys');
