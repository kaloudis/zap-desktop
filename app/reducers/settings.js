// ------------------------------------
// Constants
// ------------------------------------
export const SET_SETTINGS_OPEN = 'SET_SETTINGS_OPEN'
export const SET_ACTIVE_SUBMENU = 'SET_ACTIVE_SUBMENU'

// ------------------------------------
// Actions
// ------------------------------------
export function setSettingsOpen(settingsOpen) {
  return {
    type: SET_SETTINGS_OPEN,
    settingsOpen
  }
}

export function setActiveSubMenu(activeSubMenu) {
  return {
    type: SET_ACTIVE_SUBMENU,
    activeSubMenu
  }
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SET_SETTINGS_OPEN]: (state, { settingsOpen }) => ({ ...state, settingsOpen }),
  [SET_ACTIVE_SUBMENU]: (state, { activeSubMenu }) => ({ ...state, activeSubMenu })
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  settingsOpen: false,
  activeSubMenu: null
}

export default function settingsReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
