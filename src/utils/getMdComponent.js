const mdComponents = import.meta.glob(`/docs/components/*.vue`);
const components = {};

Object.entries(mdComponents).forEach(([path, m]) => {
	const name = path.split('/').pop().slice(0, -4)
	components[name] = m;
});

export default components;
