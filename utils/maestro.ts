import { flatten } from "lodash";
interface LooseObject {
	[key: string]: any;
}

module.exports = class Maestro {
	set: number[];

	constructor(set: number[]) {
		this.set = set;
	}

	transposeSet(transposition: number) {
		return this.set.map((pitch: number) => {
			let transposed = pitch + transposition;
			if (transposed > 12) transposed = transposed - 12;
			return transposed;
		});
	}

	transposePitchUp(originalPitch: number, transposeBy: number) {
		let transposed = originalPitch + transposeBy;
		if (transposed > 12) transposed = transposed - 12;
		return transposed;
	}

	transposePitchDown(originalPitch: number, transposeBy: number) {
		let transposed = originalPitch - transposeBy;
		if (transposed < 0) transposed = Math.abs(transposed);
		if (transposed > 12) transposed = transposed - 12;
		return transposed;
	}

	findIntervals(set: number[]) {
		if (!set) set = this.set;

		const result = set.map((pitch: number, index: number) => {
			if (pitch === 0) {
				const interval = set[index + 1];
				if (interval) {
					return { [interval]: "up" };
				}
			} else if (index === set.length) {
				return this.minusFromTheGreatest(pitch, set[0]);
			} else {
				return this.minusFromTheGreatest(pitch, set[index + 1]);
			}
		});
		return result.filter((intervalObj) => intervalObj !== undefined);
	}

	minusFromTheGreatest(index: number, indexPlusOne: number) {
		if (index > indexPlusOne) {
			const interval = index - indexPlusOne;
			if (!isNaN(interval)) {
				return { [interval]: "down" };
			}
		} else {
			const interval = indexPlusOne - index;
			if (!isNaN(interval)) {
				return { [interval]: "up" };
			}
		}
	}

	rotateSetStrav() {
		return flatten(this.findRotatedIntervals());
	}

	findRotatedIntervals() {
		let result = [];
		let i = 0;
		const mutatedSet = [...this.set];
		while (i < mutatedSet.length) {
			const firstPitch = mutatedSet.shift();
			mutatedSet.push(firstPitch);
			const newArray = [...mutatedSet];
			const intervals = this.findIntervals(newArray);
			const rotations = this.transposeRotatedIntervals(intervals, newArray);
			result.push(rotations);
			i++;
		}
		return result;
	}

	transposeRotatedIntervals(rotatedIntervals: any[], set: number[]) {
		return rotatedIntervals.map((intervals, index) => {
			let transpositions = [];
			for (const [key, value] of Object.entries(intervals)) {
				if (value === "up") {
					const transposedPitch = this.transposePitchUp(
						parseInt(key),
						set[index]
					);
					transpositions.push(transposedPitch);
				} else if (value === "down") {
					const transposedPitch = this.transposePitchDown(
						parseInt(key),
						set[index]
					);
					transpositions.push(transposedPitch)
				}
			}
			return transpositions;
		});
	}

	moveLeft(set: number[]) {
		set.push(set.shift());
		return set;
	}
};
