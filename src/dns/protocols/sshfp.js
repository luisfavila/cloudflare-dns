import Record from '../record'

export default class SSHFP extends Record {
	isEqual(recordTo) {
		return super.isEqual(recordTo)
			&& this.data && recordTo.data
			&& this.data.type === recordTo.data.type
			&& this.data.algorithm === recordTo.data.algorithm
	}

	static normalize(record) {
		record = super.normalize(record)
		record = this.normalizeContent(record)
		return this.normalizeData(record)
	}

	static fromString(record) {
		record = super.fromString(record)
		return this.normalizeData(record)
	}

	static normalizeContent(record) {
		const string = record.data && `${record.data.algorithm} ${record.data.type} ${record.data.fingerprint}`
		return {
			...record,
			content: string || record.content.split('\t').join(' ') || null
		}
	}

	static normalizeData(record) {
		const fromData = () => ({
			algorithm: record.data.algorithm ? parseInt(record.data.algorithm, 10) : undefined,
			type: record.data.type ? parseInt(record.data.type, 10) : undefined,
			fingerprint: record.data.fingerprint
		})
		const fromContent = () => {
			const parts = record.content.split(' ')
			return {
				algorithm: parseInt(parts[0], 10),
				type: parseInt(parts[1], 10),
				fingerprint: parts[2]
			}
		}
		return {
			...record,
			data: record.data ? fromData() : fromContent()
		}
	}
}
