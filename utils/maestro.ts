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
		if (transposed < 0) {
			console.log("transposed is less than 0", transposed);
			transposed = transposed + 12 
			console.log('transposed: corrected', transposed)
			console.log('originalPitch :', originalPitch)
		}
		if (transposed > 12) {
			console.log("transposed is greater than 12", transposed);
			transposed = transposed - 12;
			console.log('transposed: corrected', transposed)
			console.log('originalPitch :', originalPitch)
		}
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
		return this.findRotatedIntervals();
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
			console.log({ intervals });
			const plottedIntervals = this.plotIntervals(intervals);
			result.push(plottedIntervals);
			i++;
		}
		return result;
	}

	plotIntervals(intervals: any) {
		let pivotPitch = 0;
		let result = [0];
		result.push(
			intervals.map((interval, index) => {
				const key = Object.keys(interval);
				const transposition = key[0];
				const direction = interval[transposition];
				if (direction === "up") {
					pivotPitch = this.transposePitchUp(
						pivotPitch,
						parseInt(transposition)
					);
					return pivotPitch;
				} else {
					pivotPitch = this.transposePitchDown(
						pivotPitch,
						parseInt(transposition)
					);
					return pivotPitch;
				}
			})
		);
		return flatten(result);
	}

	moveLeft(set: number[]) {
		set.push(set.shift());
		return set;
	}
};
