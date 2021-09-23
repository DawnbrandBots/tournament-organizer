interface Result {
	matchId: string;
	opponentId: string;
	result: "w" | "l" | "d";
}

/** Class representing a player. */
export class Player {
	/**
	 * Name of the player.
	 * @type {String}
	 */
	private alias: string;

	/**
	 * Alphanumeric string ID.
	 * @type {String}
	 */
	private id: string;

	/**
	 * Value to sort players.
	 * @type {?Number}
	 */
	private seed: number | null;

	/**
	 * Number of match points the player has.
	 * @type {Number}
	 */
	private matchPoints: number;

	/**
	 * Number of matches played.
	 * @type {Number}
	 */
	private matches: number;

	/**
	 * Number of game points the player has.
	 * @type {Number}
	 */
	private gamePoints: number;

	/**
	 * Number of games played.
	 * @type {Number}
	 */
	private games: number;

	/**
	 * Number of initial byes assigned.
	 * @type {Number}
	 */
	private initialByes: number;

	/**
	 * Number of byes assigned.
	 * @type {Number}
	 */
	private byes: number;

	/**
	 * Array of results. Objects include match ID, opponent ID, and result ('w', 'l', or 'd').
	 * @type {Object[]}
	 */
	private results: Result[];

	/**
	 * Color preference for chess tournaments.
	 * Add 1 for white (player one) and subtract 1 for black (player two).
	 * @type {Number}
	 */
	private colorPref: number;

	/**
	 * Array of colors that player has played in a chess tournament.
	 * @type {String[]}
	 */
	private colors: string[];

	/**
	 * If the player is still in the tournament.
	 * @type {Boolean}
	 */
	private active: boolean;

	/**
	 * Tiebreaker values.
	 * @type {Object}
	 */
	private tiebreakers: {
		matchWinPctM: number;
		matchWinPctP: number;
		oppMatchWinPctM: number;
		oppMatchWinPctP: number;
		gameWinPct: number;
		oppGameWinPct: number;
		oppOppMatchWinPct: number;
		solkoff: number;
		cutOne: number;
		median: number;
		neustadtl: number;
		cumulative: number;
		oppCumulative: number;
	};

	/**
	 * An object to store any additional information.
	 * @type {Object}
	 * @default {}
	 */
	private etc: { [key: string]: string };

	/**
	 * Create a new player.
	 * @param {String|Object} alias String to be the player's name. If an object, it is a player being reclassed.
	 * @param {String} id String to be the player ID.
	 * @param {?Number} seed Number to be used as the seed.
	 */
	constructor(alias: string | object, id: string, seed: number | null) {
		if (arguments.length === 1) {
			const oldPlayer: Player = arguments[0];
			// manually set defaults to satisfy ts
			oldPlayer.results ||= [];
			oldPlayer.colors ||= [];
			// manually assign to satisfy ts
			this.alias = oldPlayer.alias;
			this.id = oldPlayer.id;
			this.seed = oldPlayer.seed;
			this.matchPoints = oldPlayer.matchPoints;
			this.matches = oldPlayer.matches;
			this.gamePoints = oldPlayer.gamePoints;
			this.games = oldPlayer.games;
			this.initialByes = oldPlayer.initialByes;
			this.results = oldPlayer.results;
			this.byes = oldPlayer.byes;
			this.colorPref = oldPlayer.colorPref;
			this.colors = oldPlayer.colors;
			this.active = oldPlayer.active;
			this.tiebreakers = oldPlayer.tiebreakers;
			this.etc = oldPlayer.etc;
		} else {
			this.alias = alias.toString();
			this.id = id.toString();
			this.seed = typeof seed === "number" ? seed : null;
			this.matchPoints = 0;
			this.matches = 0;
			this.gamePoints = 0;
			this.games = 0;
			this.initialByes = 0;
			this.byes = 0;
			this.results = [];
			this.colorPref = 0;
			this.colors = [];
			this.active = true;
			this.tiebreakers = {
				matchWinPctM: 0,
				matchWinPctP: 0,
				oppMatchWinPctM: 0,
				oppMatchWinPctP: 0,
				gameWinPct: 0,
				oppGameWinPct: 0,
				oppOppMatchWinPct: 0,
				solkoff: 0,
				cutOne: 0,
				median: 0,
				neustadtl: 0,
				cumulative: 0,
				oppCumulative: 0
			};

			this.etc = {};
		}
	}
}
