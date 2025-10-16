const blinkCameraLabelPattern = /camera \d+, facing/
const geckoCameraLabelPattern = /Facing [a-z]+: \d+/

export function getUsableMediaDevices(mediaDevices: MediaDeviceInfo[]) {
    // blink on android 
    let usables = mediaDevices.filter(it => blinkCameraLabelPattern.test(it.label));
    if (usables.length === 0) {
        // gecko on android 
        usables = mediaDevices.filter(it => geckoCameraLabelPattern.test(it.label));
    }

    if (usables.length > 0) {
        // well, i dont know if the problem is fucking samsung or not but this is to be safe

        // same logic for both blink and gecko on android
        const other = mediaDevices.filter(it => !blinkCameraLabelPattern.test(it.label));
        const sorted = mediaDevices.toSorted((a, b) => a.label.localeCompare(b.label));

        const front = sorted.find(it => it.label.includes("front"));
        const back = sorted.find(it => it.label.includes("back"));

        return [front, back, ...other].filter(it => it !== undefined);
    }


    // every devices is usable
    // iOS/iPadOs/blink on windows 
    // untested: gecko on windows, webkit on macos
    // i know this is bad, but who tf gonna use like ladybird, or trident edge

    return mediaDevices;
}

