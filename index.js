import CF from './src/CloudFlare'
import DNS from './src/dns/index'

/**
 * Constructs and returns a new Cloudflare API client with the specified authentication.
 *
 * @class Cloudflare
 * @param {Object} auth - The API authentication for an account
 * @param {string} auth.email - The account email address
 * @param {string} auth.key - The account API key
 * @param {string} auth.token - The API token
 *
 * @property {DNS} dns - Extended DNS Records API
 * @property {DNSRecords} dnsRecords - DNS Records instance
 * @property {IPs} ips - IPs instance
 * @property {Zones} zones - Zones instance
 * @property {ZoneSettings} zoneSettings - Zone Settings instance
 * @property {ZoneCustomHostNames} zoneCustomHostNames - Zone Custom Host Names instance
 * @property {User} user - User instance
 * @function applyPlugin - Applies a new plugin
 */
export default function CloudFlare(auth) {
	const cloudflare = CF(auth)
	cloudflare.applyPlugin(DNS)
	return cloudflare
}

export { DNS }
