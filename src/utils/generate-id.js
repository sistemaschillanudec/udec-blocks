export default function ( length = 9 ) {
	const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
	let out = '';
	for ( let i = 0; i < length; i++ ) {
		const rand = Math.floor( Math.random() * 36 );
		out += chars[ rand ];
	}
	return out;
}
