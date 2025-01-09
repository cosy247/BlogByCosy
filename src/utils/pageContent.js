const files = import.meta.glob('/docs/**/*.md' , {
	query: '?raw',
	import: 'default',
})

export default files
