export function addOrRemove<T>(array: T[], value: T) {
	if (array.includes(value)) {
		return array.filter(v => v !== value);
	} else {
		return array.concat([value]);
	}
}

export function addOrReplace<T>(array: T[], value: T, predicate: (value: T) => boolean) {
	if (array.some(predicate)) {
		return replaceItem(array, value, predicate);
	} else {
		return array.concat([value]);
	}
}

export function replaceItem<T>(array: T[], value: T, predicate: (value: T) => boolean) {
	const index = array.findIndex(predicate);
	return replaceItemAt(array, value, index);
}

export function replaceItemAt<T>(array: T[], value: T, index: number) {
	return Object.assign([...array], { [index]: value });
}
