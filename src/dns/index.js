import { SSHFP, Default } from './protocols/index'

export default function (cloudflare) {
	async function create(zone, record) {
		if (Array.isArray(record)) return Promise.all(record.map(r => create(zone, r)))
		const normalizedRecord = normalize(record)
		const response = createRecord(zone, normalizedRecord)
		return {
			...response,
			result: normalize(response.result)
		}
	}

	async function update(zone, record) {
		if (Array.isArray(record)) return Promise.all(record.map(r => update(zone, r)))
		const normalizedRecord = normalize(record)
		const found = await findRecord(zone, normalizedRecord)
		const response = await (
			found ? updateRecord(zone, found, normalizedRecord) : createRecord(zone, normalizedRecord)
		)
		return {
			...response,
			result: normalize(response.result)
		}
	}

	async function createRecord(zone, record) {
		record = prepare(record)
		return cloudflare.dnsRecords.add(zone, record)
	}

	async function updateRecord(zone, oldRecord, newRecord) {
		newRecord = prepare(newRecord)
		return cloudflare.dnsRecords.edit(zone, oldRecord.id, newRecord)
	}

	async function findRecord(zone, record) {
		record = prepare(record)
		const response = await cloudflare.dnsRecords.browse(zone, { per_page: 40 })
		return response.result.find(r => isEqual(record, r))
	}

	function isEqual(recordFrom, recordTo) {
		if (recordFrom.type !== recordTo.type
			|| recordFrom.name !== recordTo.name) {
			return false
		}
		return getType(recordFrom).isEqual(recordFrom, recordTo)
	}

	function normalize(record) {
		if (Array.isArray(record)) return record.map(normalize)
		if (typeof record === 'string') record = fromString(record)
		return getType(record).normalize(record)
	}

	function prepare(record) {
		if (Array.isArray(record)) return record.map(prepare)
		return getType(record).prepare(record)
	}

	function fromString(input) {
		const [name, , type, ...content] = input
			.split(' ').join(',')
			.split('\t').join(',')
			.split(',')
		const record = {
			name,
			type,
			content: content.join(' ')
		}
		return getType(record).fromString(record)
	}

	function getType(record) {
		switch (record.type.toLowerCase()) {
			case 'sshfp': return SSHFP
			default: return Default
		}
	}

	cloudflare.dns = { create, update }
}
