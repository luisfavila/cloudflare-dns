import { SSHFP, Default } from './protocols/index'

export default function (cloudflare) {
	async function create(zone, record) {
		if (Array.isArray(record)) return Promise.all(record.map(r => create(zone, r)))
		const normalizedRecord = normalize(record)
		return createRecord(zone, normalizedRecord)
	}

	async function update(zone, record) {
		if (Array.isArray(record)) return Promise.all(record.map(r => update(zone, r)))
		const normalizedRecord = normalize(record)
		const found = await findRecord(zone, normalizedRecord)
		return found ? updateRecord(zone, found, normalizedRecord) : createRecord(zone, normalizedRecord)
	}
	function fromString(input) {
		const [, , type] = input.split(' ')
		return getType(type).fromString(input)
	}

	async function createRecord(zone, record) {
		const response = await cloudflare.dnsRecords.add(zone, record.toJSON())
		return {
			...response,
			result: normalize(response.result)
		}
	}

	async function updateRecord(zone, oldRecord, newRecord) {
		const response = await cloudflare.dnsRecords.edit(zone, oldRecord.id, newRecord.toJSON())
		return {
			...response,
			result: normalize(newRecord)
		}
	}

	async function findRecord(zone, record) {
		const response = await cloudflare.dnsRecords.browse(zone, { per_page: 40 })
		const records = normalize(response.result)
		return records.find(r => record.isEqual(r))
	}

	function normalize(record) {
		if (Array.isArray(record)) return record.map(normalize)
		if (typeof record === 'string') record = fromString(record)
		return new (getType(record))(record)
	}

	function getType(record) {
		const type = typeof record === 'object' ? record.type : record
		switch (type.toLowerCase()) {
			case 'sshfp': return SSHFP
			default: return Default
		}
	}

	cloudflare.dns = { create, update, fromString }
}
