import strip from 'strip-ansi';

const pad2d = (str: string[] | string, w: number, h: number) => {
  let arr = typeof str === 'string' ? str.split('\n') : str;
  arr = arr.map((line) => line.padEnd(w, ' '));
  /*
  line⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵ |
  even bigger line⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵ |
  extra mega giganticly enormous line + All level, ready to be concatenated
  bigger line⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵ |
  how big even is this line⎵⎵⎵⎵⎵⎵⎵⎵⎵⎵ |
  */
  arr = [ ...arr, ...Array(h).fill(' '.repeat(h)) ];
  /*
  +---+ \      
  |box| |      
  +---+ + maxY 
  ⎵⎵⎵⎵⎵ |      
  ⎵⎵⎵⎵⎵ /      
  */
  return arr.join('\n');
};

const getColorOffset = (text: string) => text.length - strip(text).length;

const merge = (axis: 'X' | 'Y' = 'X', ...texts: string[]): string => { // TODO add options for flex and v align support
  if (axis === 'X') {
    const maxY = Math.max(...texts.map((text) => text.split('\n').length)); // get total height of result
    /*
    +---+-----------+ \
    |box|           | |
    +---+ other box | + maxY
        |           | |
        +-----------+ /
    */
    const rects = texts.map((text) => {
      let arr = text.split('\n');
      const maxX = Math.max(...arr.map((line) => strip(line).length)); // get total width of text
      /*
      line
      even bigger line
      extra mega giganticly enormous line
      bigger line
      how big even is this line
      \_________________________________/
                     maxX
      */
      arr = pad2d(arr, maxX, maxY).split('\n');
      return arr.join('\n');
    });

    return rects.reduce((p: string[], c: string) => {
      const arr = c.split('\n');
      return p.map((line, idx) => line + arr[idx]);
    }, Array(maxY).fill('')).join('\n');
  } else if (axis === 'Y') {
    const returnArr = texts.join('\n').split('\n');
    const maxX = Math.max(...returnArr.map((line) => strip(line).length));

    return returnArr
      .map((line) => line
        .padEnd(maxX + getColorOffset(line), ' '))
      .join('\n');
    // Not necessary but facilitates processing for later renderers
  }
  throw new Error(`Axis ${axis} doesn't exist`);
};

const parseColor = (hex: string | [number, number, number]): string | [number, number, number] => {
  if (typeof hex !== 'string') return hex;
  const hexData = hex.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (!hexData) return hex;
  const r = parseInt(hexData[1], 16);
  const g = parseInt(hexData[2], 16);
  const b = parseInt(hexData[3], 16);
  return [r, g, b];
};

export { merge, parseColor, pad2d };
