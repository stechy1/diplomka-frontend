import { NavigationState } from "./navigation.state";
import { Action, createReducer, on } from "@ngrx/store";

import * as NavigationActions from './navigation.actions';

export const navigationReducerKey = 'navigation';

export function navigationReducer(navigationState: NavigationState, navigationAction: Action) {
  return createReducer(
    {
        title: '',
        titleArgs: {},
        subtitle: '',
        subtitleArgs: {},
        icon: '',
        working: false,
        applyCustomNavColor: false,
        customNavColor: '',
        hasPageTools: false,
        pageToolsComponent: null,
        showSidebar: false
      // }
    },
    on(NavigationActions.actionNavigationChange, (state: NavigationState, action) => ({
      ...state,
        title: action.title,
        titleArgs: {},
        subtitle: '',
        subtitleArgs: {},
        icon: '',
        working: false,
        applyCustomNavColor: action.applyCustomNavColor,
        customNavColor: '',
        hasPageTools: action.hasPageTools,
        pageToolsComponent: action.pageToolsComponent
    })),
    on(NavigationActions.actionTitleArgsChange, (state: NavigationState, action) => ({
      ...state,
        titleArgs: action.titleArgs
    })),
    on(NavigationActions.actionSubtitleChange, (state: NavigationState, action) => ({
      ...state,
        subtitle: action.subtitle
    })),
    on(NavigationActions.actionSubtitleArgsChange, (state: NavigationState, action) => ({
      ...state,
        subtitleArgs: action.subtitleArgs
    })),
    on(NavigationActions.actionIconChange, (state: NavigationState, action) => ({
      ...state,
        icon: action.icon
    })),
    on(NavigationActions.actionWorkingChange, (state: NavigationState, action) => ({
      ...state,
        working: action.working
    })),
    on(NavigationActions.actionCustomNavColorChange, (state: NavigationState, action) => ({
      ...state,
        customNavColor: action.customNavColor
    })),

    on(NavigationActions.actionToggleSidebar, (state: NavigationState, action) => ({
      ...state,
        showSidebar: !state.showSidebar
    })),
    on(NavigationActions.actionSetShowSidebar, (state: NavigationState, action) => ({
      ...state,
        showSidebar: action.showSidebar
    })),
  )(navigationState, navigationAction);
}
