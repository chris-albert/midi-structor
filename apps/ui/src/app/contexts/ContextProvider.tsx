import React from 'react'

const NotFoundContext = <A,>(): A => {
    throw new Error("Trying to use MidiContext without using MidiProvider.")
}

export type ContextProviderProps<A> = {
    context: () => A | undefined
    noContext: () => React.ReactElement
    withContext: () => React.ReactElement
}

export const ContextProvider = <A,>({
    context,
    noContext,
    withContext
}: ContextProviderProps<A>): React.ReactElement => {

    const Context: React.Context<() => A> =
        React.createContext(NotFoundContext<A>)

    const Provider = Context.Provider

    const c = context()

    if(c === undefined) {
        return noContext()
    } else {
        return (
            <Provider value={() => c}>
                {withContext()}
            </Provider>
        )
    }
}
