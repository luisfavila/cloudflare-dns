const { expect } = require('chai')
const CloudflareAPI = require('cloudflare')
const Cloudflare = require('../src/index')

const AUTH = {}
const cloudflare = new Cloudflare(AUTH)
const cloudflareApi = new CloudflareAPI(AUTH)

describe('Test CloudFlare API exposal', () => {
	it('checks existance of cloudflare API', () => {
		expect(cloudflare).to.deep.include(cloudflareApi)
	})
})
