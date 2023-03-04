class midiUtils {
    
    midiUtils() {
        initializeFreqsEqualTemp();
    }
    
    const zxcvbn_qwerty = {
        "z": 48, "Z": 48,
        "s": 49, "S": 49,
        "x": 50, "X": 50,
        "d": 51, "D": 51,
        "c": 52, "C": 52,
        "v": 53, "V": 53,
        "g": 54, "G": 54,
        "b": 55, "B": 55,
        "h": 56, "H": 56,
        "n": 57, "N": 57,
        "j": 58, "J": 58,
        "m": 59, "M": 59,
        ",": 60, "<": 60,
        "q": 60, "Q": 60,
        "2": 61, "@": 61,
        "w": 62, "W": 62,
        "3": 63, "#": 63,
        "e": 64, "E": 64,
        "r": 65, "R": 65,
        "5": 66, "%": 66,
        "t": 67, "T": 67,
        "6": 68, "^": 68,
        "y": 69, "Y": 69,
        "7": 70, "&": 70,
        "u": 71, "U": 71,
        "i": 72, "I": 72,
    };
    
    midiFreq = [];
    keyMidi = zxcvbn_qwerty;

    initializeFreqs() {
        for (let i = 0; i < 128; i++) {
            midiFreq[i] = 440;
        }
    }

    initializeFreqsEqualTemp() {
        for (let i = 0; i < 128; i++) {
            midiFreq[i] = midiNumToFreq(i);
        }
    }

    noteOn(n) {
        if (!(n === undefined)) {
        osc = new p5.Oscillator('sawtooth');
        osc.freq(midiFreq[n], 0);
        osc.amp(0.1, 0);
        osc.start();
        osc.amp(0, 1.5);
        }
    }
}