import {atomWithStorage} from "jotai/utils";
import {focusAtom} from "jotai-optics";

export type Settings = {
  zoom: number
}

export const defaultSettings = (): Settings => ({
  zoom: 0
})

export const settingsAtom = atomWithStorage('settings', defaultSettings())

export const zoomAtom = focusAtom(settingsAtom, o => o.prop('zoom'))