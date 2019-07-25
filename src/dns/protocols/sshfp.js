export default {
	isEqual(a, b) {
		const first = a.content.split('\t')
		const second = b.content.split('\t')
		return first[0] === second[0] && first[1] === second[1]
	},

	normalize(record) {
		return {
			...record,
			content: record.content ? record.content.split(' ').join('\t') : undefined,
			data: record.data ? {
				algorithm: record.data.algorithm ? parseInt(record.data.algorithm, 10) : undefined,
				type: record.data.type ? parseInt(record.data.type, 10) : undefined,
				fingerprint: record.data.fingerprint
			} : undefined
		}
	},

	prepare(record) {
		return {
			...record,
			content: record.data && !record.content ? this.toString(record) : record.content,
			data: record.content && !record.data ? this.fromString(record) : record.data
		}
	},

	toString(record) {
		const string = record.data && `${record.data.algorithm}\t${record.data.type}\t${record.data.fingerprint}`
		return string || record.content || null
	},

	fromString(record) {
		const parts = record.content.split('\t')
		return {
			...record,
			data: parts ? {
				algorithm: parseInt(parts[0], 10),
				type: parseInt(parts[1], 10),
				fingerprint: parts[2]
			} : record.data
		}
	}
}
