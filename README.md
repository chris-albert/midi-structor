# MIDI Structor

## Downloading app from releases
Since MacOS apps need to be signed, if you just download the app from the [releases](./releases) and try to install
it, you will see `“MIDI Structor” is damaged and can’t be opened. You should eject the disk image.`
The image is in fact not damaged and just being blocked by a MacOS program called [Gatekeeper](https://support.apple.com/guide/security/gatekeeper-and-runtime-protection-sec5599b66df/web).

There are however a few workaround discussed [here](https://disable-gatekeeper.github.io/). 
I like the `curl` route, which means you just need to run 
```bash
curl -LO 'https://github.com/chris-albert/midi-structor/releases/download/v0.0.5/MIDI.Structor.v0.0.5.arm64.dmg'
```
and then open the downloaded file.



