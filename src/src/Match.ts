import { Player, Result } from "./Player";

/** Class representing a match. */
export class Match {
	/**
	 * Unique ID for the match.
	 * @type {String}
	 */
	readonly id: string;
	/**
	 * Round number for the match.
	 * @type {Number}
	 */
	readonly round: number;
	/**
	 * Match number.
	 * @type {Number}
	 */
	readonly matchNumber: number;
	/**
	 * Player number one in the match.
	 * If null, the player has not been determined.
	 * @type {?Player}
	 * @default null
	 */
	public playerOne: Player | null;
	/**
	 * Player number two in the match.
	 * If null, the player has not been determined.
	 * @type {?Player}
	 * @default null
	 */
	public playerTwo: Player | null;
	/**
	 * The status of the match.
	 * @type {Boolean}
	 * @default false
	 */
	public active: boolean;
	/**
	 * Number of wins for player one.
	 * @type {Number}
	 * @default 0
	 */
	public playerOneWins: number;
	/**
	 * Number of wins for player two.
	 * @type {Number}
	 * @default 0
	 */
	public playerTwoWins: number;
	/**
	 * Number of draws.
	 * @type {Number}
	 * @default 0
	 */
	public draws: number;
	/**
	 * Next match for the winner.
	 * Used in elimination formats.
	 * @type {?Match}
	 * @default null
	 */
	public winnerPath: Match | null;
	/**
	 * Next match for the loser.
	 * Used in elimination formats.
	 * @type {?Match}
	 * @default null
	 */
	public loserPath: Match | null;

	/**
	 * Create a new match.
	 * @param {String|Object} id The unique ID for the match. If an object, it is a match being reclassed.
	 * @param {Number} round The round number for the match.
	 * @param {Number} matchNumber The match number.
	 * @param {?Player[]} players Array of players for the match.
	 */
	constructor(id: string | Match, round?: number, matchNumber?: number, players: Array<Player | null> | null = null) {
		if (arguments.length === 1) {
			// manual assign for ts
			const oldMatch: Match = arguments[0];
			this.id = oldMatch.id;
			this.round = oldMatch.round;
			this.matchNumber = oldMatch.matchNumber;
			this.playerOne = oldMatch.playerOne;
			this.playerTwo = oldMatch.playerTwo;
			this.active = oldMatch.active;
			this.playerOneWins = oldMatch.playerOneWins;
			this.playerTwoWins = oldMatch.playerTwoWins;
			this.draws = oldMatch.draws;
			this.winnerPath = oldMatch.winnerPath;
			this.loserPath = oldMatch.loserPath;
		} else {
			this.id = id.toString();
			this.round = round!;
			this.matchNumber = matchNumber!;

			this.playerOne = null;

			this.playerTwo = null;

			// Setting players if in the constructor.
			if (players !== null && players.length === 2) {
				this.playerOne = players[0];
				this.playerTwo = players[1];
			}

			this.active = false;

			this.playerOneWins = 0;

			this.playerTwoWins = 0;

			this.draws = 0;

			this.winnerPath = null;

			this.loserPath = null;
		}
	}

	/**
	 * Updates player values for a result.
	 * @param {Number} wv The value of a win.
	 * @param {Number} lv The value of a loss.
	 * @param {Number} dv The value of a draw.
	 */
	resultForPlayers(wv: number, lv: number, dv: number) {
		this.playerOne!.gamePoints += this.playerOneWins * wv + this.draws * dv;
		this.playerTwo!.gamePoints += this.playerTwoWins * wv + this.draws * dv;
		this.playerOne!.games += this.playerOneWins + this.playerTwoWins + this.draws;
		this.playerTwo!.games += this.playerOneWins + this.playerTwoWins + this.draws;
		let playerOneResult: Result = { match: this.id, opponent: this.playerTwo!.id };
		let playerTwoResult: Result = { match: this.id, opponent: this.playerOne!.id };
		if (this.playerOneWins > this.playerTwoWins) {
			this.playerOne!.matchPoints += wv;
			playerOneResult.result = "w";
			this.playerTwo!.matchPoints += lv;
			playerTwoResult.result = "l";
		} else if (this.playerOneWins < this.playerTwoWins) {
			this.playerOne!.matchPoints += lv;
			playerOneResult.result = "l";
			this.playerTwo!.matchPoints += wv;
			playerTwoResult.result = "w";
		} else {
			this.playerOne!.matchPoints += dv;
			playerOneResult.result = "d";
			this.playerTwo!.matchPoints += dv;
			playerTwoResult.result = "d";
		}
		this.playerOne!.matches++;
		this.playerTwo!.matches++;
		this.playerOne!.results.push(playerOneResult);
		this.playerTwo!.results.push(playerTwoResult);
	}

	/**
	 * Clearing previous results of a match for player values.
	 * @param {Number} wv The value of a win.
	 * @param {Number} lv The value of a loss.
	 * @param {Number} dv The value of a draw.
	 */
	resetResults(wv: number, lv: number, dv: number) {
		this.playerOne!.gamePoints -= this.playerOneWins * wv + this.draws * dv;
		this.playerTwo!.gamePoints -= this.playerTwoWins * wv + this.draws * dv;
		this.playerOne!.games -= this.playerOneWins + this.playerTwoWins + this.draws;
		this.playerTwo!.games -= this.playerOneWins + this.playerTwoWins + this.draws;
		if (this.playerOneWins > this.playerTwoWins) {
			this.playerOne!.matchPoints -= wv;
			this.playerTwo!.matchPoints -= lv;
		} else if (this.playerOneWins < this.playerTwoWins) {
			this.playerOne!.matchPoints -= lv;
			this.playerTwo!.matchPoints -= wv;
		} else {
			this.playerOne!.matchPoints -= dv;
			this.playerTwo!.matchPoints -= dv;
		}
		this.playerOne!.matches--;
		this.playerTwo!.matches--;
		this.playerOne!.results.splice(
			this.playerOne!.results.findIndex(a => a.match === this.id),
			1
		);
		this.playerTwo!.results.splice(
			this.playerTwo!.results.findIndex(a => a.match === this.id),
			1
		);
	}

	/**
	 * Assign a bye to a player.
	 * @param {1|2} player Which player in the match gets a bye.
	 * @param {Number} wv The value of a win.
	 */
	assignBye(player: 1 | 2, wv: number) {
		if (player === 1) {
			this.playerOne!.gamePoints += this.playerOneWins * wv;
			this.playerOne!.games += this.playerOneWins;
			this.playerOne!.matchPoints += wv;
			this.playerOne!.matches++;
			this.playerOne!.byes++;
		} else {
			this.playerTwo!.gamePoints += this.playerTwoWins * wv;
			this.playerTwo!.games += this.playerTwoWins;
			this.playerTwo!.matchPoints += wv;
			this.playerTwo!.matches++;
			this.playerTwo!.byes++;
		}
	}
}
