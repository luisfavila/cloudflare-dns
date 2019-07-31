import { expect } from 'chai'
import { SSHFP } from '../src/dns/protocols'
import CloudFlare from '../index'

const AUTH = {}
const cloudflare = new CloudFlare(AUTH)

const recordString = 'example.com IN SSHFP 1 1 123'
const recordInfo = {
	type: 'SSHFP',
	name: 'example.com',
	content: '1 1 123',
	data: {
		algorithm: 1,
		type: 1,
		fingerprint: '123'
	}
}
const record = new SSHFP(recordInfo)

describe('Test SSHFP class', () => {
	it('checks correct construction', () => {
		expect(record).to.deep.include(recordInfo)
	})

	it('checks toJSON() method', () => {
		expect(record.toJSON()).to.deep.equal(recordInfo)
	})

	it('checks isEqual(to) method', () => {
		const recordEqual = new SSHFP({
			...recordInfo,
			content: null,
			data: {
				algorithm: 1,
				type: 1,
				fingerprint: '321'
			}
		})
		const recordNotEqual = new SSHFP({
			...recordInfo,
			content: null,
			data: {
				algorithm: 2,
				type: 2,
				fingerprint: '123'
			}
		})
		expect(record.isEqual(recordEqual)).to.equal(true)
		expect(record.isEqual(recordNotEqual)).to.equal(false)
	})

	it('checks toString() method', () => {
		expect(record.toString()).to.equal(recordString)
	})

	it('checks fromString() method', () => {
		expect(SSHFP.fromString(recordString)).to.deep.equal(recordInfo)
	})

	it('checks normalize() method', () => {
		expect(SSHFP.normalize({
			...recordInfo,
			content: undefined
		})).to.deep.equal(recordInfo)

		expect(SSHFP.normalize({
			...recordInfo,
			data: undefined
		})).to.deep.equal(recordInfo)
	})
})

describe('Test SSHFP integration', () => {
	it('checks fromString() method', () => {
		console.log(cloudflare.dns.fromString(recordString))
		expect(cloudflare.dns.fromString(recordString)).to.deep.equal(recordInfo)
	})
})
