import { expect } from 'chai'
import Record from '../src/dns/record'
import CloudFlare from '../index'

const AUTH = {}
const cloudflare = new CloudFlare(AUTH)

const recordString = 'example.com IN A 127.0.0.1'
const recordInfo = {
	type: 'A',
	name: 'example.com',
	content: '127.0.0.1'
}
const record = new Record(recordInfo)

describe('Test Record class', () => {
	it('checks correct construction', () => {
		expect(record).to.deep.include(recordInfo)
	})

	it('checks toJSON() method', () => {
		expect(record.toJSON()).to.deep.equal(recordInfo)
	})

	it('checks isEqual(to) method', () => {
		const recordEqual = new Record({
			...recordInfo,
			content: '192.168.1.1'
		})
		const recordNotEqual = new Record({
			...recordInfo,
			name: 'otherdomain.com'
		})
		expect(record.isEqual(recordEqual)).to.equal(true)
		expect(record.isEqual(recordNotEqual)).to.equal(false)
	})

	it('checks toString() method', () => {
		expect(record.toString()).to.equal(recordString)
	})

	it('checks fromString() method', () => {
		expect(Record.fromString(recordString)).to.deep.equal(recordInfo)
	})

	it('checks normalize() method', () => {
		expect(Record.normalize(recordInfo)).to.deep.equal(recordInfo)
	})
})

describe('Test Record integration', () => {
	it('checks fromString() method', () => {
		expect(cloudflare.dns.fromString(recordString)).to.deep.equal(recordInfo)
	})
})
