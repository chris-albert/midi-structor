import React from 'react'
import {WindowMidi} from "../midi/WindowMidi";
import getMidiAccess from "../midi/MidiAccess";

export const useMidiContext = () => {
    const [midi, setMidi] = React.useState<WindowMidi | undefined>()

    React.useEffect(() => {
        getMidiAccess(true)
            .then(midi => {
                setMidi(midi)
            })
            .catch(console.error)
    }, [])

    return midi
}