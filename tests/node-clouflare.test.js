import { expect } from 'chai'
import CloudFlareAPI from 'cloudflare'
import CloudFlare from '../index'

const AUTH = {}
const cloudflare = new CloudFlare(AUTH)
const cloudflareApi = new CloudFlareAPI(AUTH)

describe('Test CloudFlare API exposal', () => {
	it('checks existance of cloudflare API', () => {
		expect(cloudflare).to.deep.include(cloudflareApi)
	})
})
