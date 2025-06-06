/*
  TODO:
  - Handle pipefail (`... | head`)
  - Test Buffer vs ArrayBuffer vs Array
*/

/**
 * @typedef Config
 * @prop {boolean} reverse
 * @prop {NodeJS.ReadableStream} inputStream
 * @prop {NodeJS.WritableStream} outputStream
 */

/**
 * Keep printable ASCII characters and replace others with `.`
 * Only handles the first characer
 * @param {string} x
 */
function keepPrintablOrDot(x) {
  // 0x20: `<space>`
  // 0x7e: `~`
  // 0x2e: `.`
  return 0x20 <= x && x <= 0x7e ? x : 0x2e;
}

/**
 * @param {string[]} argv
 * @returns {Config}
 */
function getConfig(argv) {
  /** @type{Config} */
  const config = {
    reverse: false,
    inputStream: process.stdin,
    outputStream: process.stdout,
  };
  for (const x of argv.slice(2)) {
    if (x === "-r") {
      config.reverse = true;
    }
  }
  return config;
  // TODO: handle file inputput output
}

/**
 * @param {Config} config
 */
function encode(config) {
  /**
   * @param {number} leftCounter
   * @param {string[]} midBuffer
   * @param {string[]} rightBuffer
   */
  function formatLine(leftCounter, midBuffer, rightBuffer) {
    return (
      leftCounter.toString(16).padStart(8, "0") +
      ": " +
      midBuffer.join(" ") +
      "  " +
      rightBuffer.join("") +
      "\n"
    );
  }

  const { inputStream, outputStream } = config;
  inputStream.setEncoding("hex");

  const cols = 16;
  const groupSize = 2;
  const readSize = 2 * groupSize; // 1 Byte takes 2 digits in Hex

  // Left section
  let leftCounter = 0;

  // Middle section
  const midBufferMax = Math.floor(cols / groupSize);
  const midBuffer = Array.from({ length: midBufferMax });
  let i = 0; // Points to most recent item in bufferHex

  // Right section
  const rightBufferMax = midBufferMax;
  const rightBuffer = Array.from({ length: rightBufferMax });

  inputStream.on("readable", () => {
    /** @type{string} */
    let data;

    while ((data = inputStream.read(readSize)) !== null) {
      midBuffer[i] = data.padEnd(readSize);

      rightBuffer[i] = Buffer.from(data, "hex")
        .map(keepPrintablOrDot) // Replace non-printables with `.`
        .toString();

      i++;

      if (i === midBufferMax) {
        outputStream.write(formatLine(leftCounter, midBuffer, rightBuffer));

        i = 0; // Reset bufferHex
        leftCounter += cols; // Increment left section
      }
    }
  });

  inputStream.on("end", () => {
    if (i) {
      // Reset rest of buffer
      for (; i < midBufferMax; i++) {
        midBuffer[i] = " ".repeat(readSize);
        rightBuffer[i] = "";
      }

      outputStream.write(formatLine(leftCounter, midBuffer, rightBuffer));
    }
  });

  inputStream.on("error", () => {
    console.error("Error from inputStream");
    process.exit(1);
  });
}

function main() {
  const config = getConfig(process.argv);
  config.outputStream.on("error", (error) => {
    if (error.code === "EPIPE") {
      // NOTE: Look into this
      process.exit(0);
    }
  });
  encode(config);
}

export {
  //
  getConfig,
  main,
};
