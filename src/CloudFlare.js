import CloudFlare from 'cloudflare'

export default function (auth) {
	const cloudflare = CloudFlare(auth)

	cloudflare.applyPlugin = (f) => {
		f(cloudflare)
	}

	return cloudflare
}
