import CloudFlare from './src/CloudFlare'
import DNS from './src/dns/index'

export default function (auth) {
	const cloudflare = CloudFlare(auth)
	cloudflare.applyPlugin(DNS)
	return cloudflare
}

export { DNS }
