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

	transposePitch(originalPitch: number, transposeBy: number) {
		let transposed = originalPitch + transposeBy;
		if (transposed > 12) transposed = transposed - 12;
		return transposed;
	}

	findIntervals(set: number[]) {
		if (!set) set = this.set;
		const result = set.map((pitch: number, index: number) => {
			if (pitch === 0) return set[index + 1];
			if (index === set.length) {
				return this.minusFromTheGreatest(pitch, set[0]);
			} else {
				return this.minusFromTheGreatest(pitch, set[index + 1]);
			}
		});
		return this.clean(result);
	}

	minusFromTheGreatest(index: number, indexPlusOne: number) {
		if (index > indexPlusOne) return index - indexPlusOne;
		return indexPlusOne - index;
	}

	rotateSetStrav() {
		const intervals = this.findRotatedIntervals()
		console.log({ intervals })
	}

	findRotatedIntervals() {
		let result = [];
		let i = 0;
		const mutatedSet = [...this.set];
		console.log('the set is', this.set)
		while (i < mutatedSet.length) {
			const shiftItem = mutatedSet.shift();
			mutatedSet.push(shiftItem);
			const newArray = [...mutatedSet];
			const intervals = this.findIntervals(newArray);
			result.push(intervals)
			i++;
		}
		return result;
	}

	moveLeft(set: number[]) {
		set.push(set.shift());
		return set;
	}

	clean(array: number[]) {
		return array.filter((pitch) => !isNaN(pitch));
	}
};
