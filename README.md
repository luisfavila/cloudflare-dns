# Extended CloudFlare API
This was made with the intent of extending [CloudFlare's Node.JS API](https://github.com/cloudflare/node-cloudflare) with more functionality.
Right now I'm only extending their DNS functionality in order to support updating existing records.

# DNS API
```js
import CloudFlare from 'cloudflare-dns'
const cf = new CloudFlare({ token: 'my-token' })
```

## Records

Records may be expressed in different ways.

**String**
```js
const record = 'example.com IN SSHFP 1 1 123456'
```

**Object**
```js
const record = {
	type: 'A',
	name: 'example.com',
	content: '127.0.0.1'
}
```

**Object** (with data, for complex records)
```js
// example.com IN SSHFP 1 2 123456
const record = {
	type: 'SSHFP',
	name: 'example.com',
	data: {
		algorithm: 1,
		type: 2,
		content: '123456'
	}
}
```

## Operations
### Create
Creates a new record.
```js
await cf.dns.create('my-zone', record)
```

### Update
Updates an existing record or creates a new one.
```js
await cf.dns.update('my-zone', record)
```
**Update is tricky**: it will match existing records based on the `name` and `type` properties on most protocols. Some exceptions exist, though, where we'll need the `content` and/or `data` properties. See the following table to understand more.

| Protocol | Content A | Content B | Match |
| --- | --- | --- | --- |
| SSHFP | 1 1 123456 | 1 1 654321 | yes |
| SSHFP | 1 1 123456 | 1 2 654321 | no |
| SSHFP | 1 1 123456 | 2 1 654321 | no |
