
export default class Record {
	constructor(record) {
		Object.assign(this, this.constructor.normalize(record))
	}

	isEqual(recordTo) {
		return this.type === recordTo.type
			&& this.name === recordTo.name
	}

	toString() {
		return `${this.name} IN ${this.type} ${this.content}`
	}

	toJSON() {
		const record = {
			type: this.type,
			name: this.name,
			content: this.content
		}
		return Object.assign(record,
			this.id && { id: this.id },
			this.data && { data: this.data })
	}

	static normalize(record) {
		return record
	}

	static fromString(input) {
		const [name, , type, ...content] = input
			.split(' ').join(',')
			.split('\t').join(',')
			.split(',')
		return {
			name,
			type,
			content: content.join(' ')
		}
	}
}
