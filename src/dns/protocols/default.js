export default {
	// Let's keep the arguments for our sake
	// eslint-disable-next-line
	isEqual(a, b) {
		return true
	},

	normalize(record) {
		return record
	},

	prepare(record) {
		return record
	},

	toString(record) {
		return `${record.name} IN ${record.type} ${record.content}`
	},

	fromString(record) {
		return record
	}

}
