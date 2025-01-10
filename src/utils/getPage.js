import { pageList } from '../../temp/docsData.json';

const pageMapByFile = pageList.reduce((m, p) => ((m[p.file] = p), m), {});

const pageMapById = pageList.reduce((m, p) => ((m[p.attrs.id] = p), m), {});

export function getPageMateByFile(file) {
  return pageMapByFile[file];
}

export function getPageMateById(id) {
  return pageMapById[id];
}

export function getPageListByStatic(name, value) {
  return pageList.filter((p) => {
    const attr = p.attrs[name];
    if (Array.isArray(attr)) {
      return attr.includes(value);
    } else if (attr.trim() !== '') {
      return name === value;
    }
  });
}
