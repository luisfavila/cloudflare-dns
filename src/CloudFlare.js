import CF from 'cloudflare'

export default function CloudFlare(auth) {
	const cloudflare = CF(auth)

	cloudflare.applyPlugin = (f) => {
		f(cloudflare)
	}

	return cloudflare
}
