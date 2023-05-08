import { createSlice } from '@reduxjs/toolkit'
import config from 'config';

const initialState = {
    isOpen: ['default'], // for active default menu
    defaultId: 'default',
    fontFamily: config.fontFamily,
    borderRadius: config.borderRadius,
    opened: true,
    travelMode: 0
}

const customizationSlice = createSlice({
  name: 'customization',
  initialState,
  reducers: {
    setMenu(state, action) {
        state.opened = action.payload
    },
    menuOpen(state, action) {
        state.isOpen = [action.payload]
    },
    setMode(state, action){
      state.travelMode = action.payload
    }
  },
})

export const { setMenu, menuOpen, setMode } = customizationSlice.actions

export default customizationSlice.reducer
