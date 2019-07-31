import CF from './src/CloudFlare'
import DNS from './src/dns/index'

export default function CloudFlare(auth) {
	const cloudflare = CF(auth)
	cloudflare.applyPlugin(DNS)
	return cloudflare
}

export { DNS }
