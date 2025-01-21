import fs from 'fs';

export default function (srcs) {
  return {
    name: 'vite-build-copy',
    apply: 'build',
		closeBundle() {
      srcs.forEach(([format, to]) => {
        fs.cp(format, to, { recursive: true }, (err) => {
          if (err) {
            console.error(err);
          }
        });
      });
    },
  };
}
