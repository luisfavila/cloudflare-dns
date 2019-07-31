import { SSHFP, Default } from './protocols/index'

export default function (cloudflare) {
	/**
	 * Create DNS record
	 *
	 * @param {string} zoneId - Cloudflare Zone ID
	 * @param {Object|string} record - The record object or string
	 * @param {string} record.name - The record name (example.com)
	 * @param {string} record.type - The record type (A)
	 * @param {string} record.content - Record content (127.0.0.1)
	 */
	async function create(zone, record) {
		if (Array.isArray(record)) return Promise.all(record.map(r => create(zone, r)))
		const normalizedRecord = normalize(record)
		return createRecord(zone, normalizedRecord)
	}

	/**
	 * Update existing DNS record or insert new one
	 *
	 * @param {string} zoneId - Cloudflare Zone ID
	 * @param {Object|string} record - The record object or string
	 * @param {string} record.name - The record name (example.com)
	 * @param {string} record.type - The record type (A)
	 * @param {string} record.content - Record content (127.0.0.1)
	 */
	async function update(zone, record) {
		if (Array.isArray(record)) return Promise.all(record.map(r => update(zone, r)))
		const normalizedRecord = normalize(record)
		const found = await findRecord(zone, normalizedRecord)
		return found ? updateRecord(zone, found, normalizedRecord) : createRecord(zone, normalizedRecord)
	}

	/**
	 * Get a record's Object representation from it's string
	 *
	 * @param {string} input - Record string
	 * @returns {Object} record - The record object
	 */
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
