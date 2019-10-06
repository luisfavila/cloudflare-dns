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
	 * @param {string|Array} input - Record string or array of record strings
	 * @returns {Object|Array} record - Record object or array of record objects
	 */
	function fromString(input) {
		if (Array.isArray(input)) return input.map(i => fromString(i))
		const [, , type] = input.split(' ').join('\t').split('\t')
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
		let info = {
			page: 0,
			total_pages: 1
		}
		const results = []
		while (info.page < info.total_pages) {
			/* eslint-disable-next-line */
			const response = await cloudflare.dnsRecords.browse(zone, { type: record.type, name: record.name, per_page: 100 })
			info = response.result_info || { page: 1, total_pages: 1 }
			results.push(...response.result)
		}
		const records = normalize(results)
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
