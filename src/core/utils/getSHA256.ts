const uint8Array = Uint8Array;
const uint32Array = Uint32Array;
const pow = Math.pow;

const DEFAULT_STATE = new uint32Array(8);
const ROUND_CONSTANTS: number[] = [];
const LittleEndian = !!new uint8Array(new uint32Array([1]).buffer)[0];
const encoder = new TextEncoder();

function convertEndian(word: number) {
    return LittleEndian ? (
        (word >>> 24) | (((word >>> 16) & 0xFF) << 8) | ((word & 0xFF_00) << 8) | (word << 24)
    ) : word;
}

function rightRotate(word: number, bits: number) {
    return (word >>> bits) | (word << (32 - bits));
}

function sha256(data: Uint8Array): Uint8Array {
    const STATE = [...DEFAULT_STATE];
    const legth = data.length;
    const bitLength = legth * 8;
    const newBitLength = 512 - ((bitLength + 64) % 512) - 1 + bitLength + 65;
    const bytes = new uint8Array(newBitLength / 8);
    const words = new uint32Array(bytes.buffer);

    bytes.set(data, 0);
    bytes[legth] = 0b1000_0000;
    words[words.length - 1] = convertEndian(bitLength);

    const M = new uint32Array(64); // Move M here

    for (let block = 0; block < newBitLength / 32; block += 16) {
        const workingState = [...STATE];

        for (let round = 0; round < 64; round++) {
            let MRound;
            if (round < 16) {
                MRound = convertEndian(words[block + round]);
            } else {
                const gamma0x = M[round - 15];
                const gamma1x = M[round - 2];
                MRound =
                    M[round - 7] +
                    M[round - 16] +
                    (rightRotate(gamma0x, 7) ^ rightRotate(gamma0x, 18) ^ (gamma0x >>> 3)) +
                    (rightRotate(gamma1x, 17) ^ rightRotate(gamma1x, 19) ^ (gamma1x >>> 10));
            }

            M[round] = MRound = Math.trunc(MRound);

            const t1 =
                (rightRotate(workingState[4], 6) ^
                    rightRotate(workingState[4], 11) ^
                    rightRotate(workingState[4], 25)) +
                ((workingState[4] & workingState[5]) ^ (~workingState[4] & workingState[6])) +
                workingState[7] +
                MRound +
                ROUND_CONSTANTS[round];
            const t2 =
                (rightRotate(workingState[0], 2) ^
                    rightRotate(workingState[0], 13) ^
                    rightRotate(workingState[0], 22)) +
                ((workingState[0] & workingState[1]) ^
                    (workingState[2] & (workingState[0] ^ workingState[1])));
            for (let i = 7; i > 0; i--) {
                workingState[i] = workingState[i - 1];
            }
            workingState[0] = Math.trunc(t1 + t2);
            workingState[4] = Math.trunc(workingState[4] + t1);
        }

        for (let round = 0; round < 8; round++) {
            STATE[round] = Math.trunc(STATE[round] + workingState[round]);
        }
    }

    return new uint8Array(new uint32Array(STATE.map(convertEndian)).buffer);
}

export function hex(bin: Uint8Array): string {
  return [...bin]
      .map(val => ('00' + val.toString(16)).slice(-2))
      .join('');
}

export function hash(str: string): string {
    return hex(sha256(encoder.encode(str)));
}

(function initialize() {
    let n = 2;
    let nPrime = 0;
    while (nPrime < 64) {
        let isPrime = true;
        for (let factor = 2; factor <= n / 2; factor++) {
            if (n % factor === 0) {
                isPrime = false;
            }
        }
        if (isPrime) {
            const getFractionalBits = (n: number) => Math.trunc((n - (Math.trunc(n))) * pow(2, 32));
            if (nPrime < 8) {
                DEFAULT_STATE[nPrime] = getFractionalBits(pow(n, 1 / 2));
            }
            ROUND_CONSTANTS[nPrime] = getFractionalBits(pow(n, 1 / 3));
            nPrime++;
        }
        n++;
    }
})();
