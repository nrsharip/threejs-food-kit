const PHASES = {
    INIT: 0,
    STARTED: 1,
    PAUSED: 2
}

const state = { 
    _phase: undefined,

    set phase(p) {
        if (p in Object.values(PHASES)) {
            console.log("Game phase: " + p);
            this._phase = p; 
        } else {
            throw new Error("Unknown game phase: " + p);
        }
    },

    get phase() { return this._phase; }
};

export { PHASES, state }