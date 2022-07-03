const PHASES = {
    INIT: 1,
    STARTED: 2,
    PAUSED: 3,

    getKey(value) { return Object.keys(this).find(key => this[key] === value) }
}

const state = { 
    _phase: undefined,

    set phase(p) {
        if (Object.values(PHASES).includes(p)) {
            console.log("Game phase: " + PHASES.getKey(p));
            this._phase = p; 
        } else {
            throw new Error("Unknown game phase: " + p + ", known: " + Object.values(PHASES));
        }
    },

    get phase() { return this._phase; }
};

export { PHASES, state }