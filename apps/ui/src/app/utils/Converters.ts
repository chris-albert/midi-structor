

export const byteArrayToJson = (ba: Uint8Array): any => {
    const accu: Array<string> = []
    ba.forEach(value => {
        accu.push(String.fromCharCode(value))
    })
    return JSON.parse(accu.join(''))
}