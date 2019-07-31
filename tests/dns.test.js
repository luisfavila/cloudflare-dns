import { expect } from 'chai'
import CloudFlare from '../index'
import Record from '../src/dns/record'

const AUTH = {}
const cloudflare = new CloudFlare(AUTH)

const DNS_METHOD_STRUCTURE = {
	dns: {
		create: 'function',
		update: 'function',
		fromString: 'function'
	}
}

const zoneId = '123'

const recordInfo = {
	type: 'A',
	name: 'example.com',
	content: '127.0.0.1'
}
const record = new Record(recordInfo)
const newRecordInfo = {
	type: 'A',
	name: 'subdomain.example.com',
	content: '127.0.0.1'
}
const newRecord = new Record(newRecordInfo)

describe('Test DNS API', () => {
	it('checks exposal of DNS methods', () => {
		checkDeepProperties(DNS_METHOD_STRUCTURE, cloudflare)
	})

	describe('Test exposed functions', () => {
		const returnResult = r => ({
			result: r,
			succcess: true,
			errors: [],
			messages: []
		})
		cloudflare.dnsRecords.add = (z, r) => ({ ...returnResult(r), created: true })
		cloudflare.dnsRecords.edit = (z, recordId, r) => ({ ...returnResult(r), updated: true })
		cloudflare.dnsRecords.browse = () => returnResult([record])

		it('tests update() function - should update', async () => {
			const response = await cloudflare.dns.update(zoneId, record)
			expect(response.result).to.deep.equal(record)
			expect(response).to.include({ updated: true })
		})

		it('tests update() function - should create', async () => {
			const response = await cloudflare.dns.update(zoneId, newRecord)
			expect(response.result).to.deep.equal(newRecord)
			expect(response).to.include({ created: true })
		})

		it('tests create() function', async () => {
			const response = await cloudflare.dns.create(zoneId, newRecord)
			expect(response.result).to.deep.equal(newRecord)
			expect(response).to.include({ created: true })
		})
	})
})


const checkDeepProperties = (props, obj) => {
	const type = typeof props
	if (type === 'object') {
		if (!Array.isArray('object')) {
			for (const key of Object.keys(props)) {
				expect(obj).to.haveOwnProperty(key)
				checkDeepProperties(props[key], obj[key])
			}
		} else {
			for (const key of props) {
				expect(obj).to.haveOwnProperty(key)
			}
		}
	} else if (type === 'string') {
		expect(obj).to.be.an(props)
	}
}
