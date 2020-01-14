export const keys = {
  navigation:  ['ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'End', 'Home', 'PageDown', 'PageUp'],
  whitespace: ['Enter', 'Tab', ' ']
};

export const pitch = 'pitch';
export const volume = 'volume';
export const speed = 'speed';
export const pause = 'pause';

export const pitchInitial = 100;
export const volumeInitial = 80;
export const speedInitial = 100;
export const pauseInitial = 0;

export const pitchMin = 50;
export const volumeMin = 0;
export const speedMin = 50;
export const pauseMin = 0;

export const pitchMax = 200;
// volume higher than 80 "can introduce clipping in the audio signal"
export const volumeMax = 100;
export const speedMax = 400;
export const pauseMax = 5000; //ms