import { marked } from 'marked';
import { createHighlighter } from 'shiki';
import { transformerColorizedBrackets } from '@shikijs/colorized-brackets';
import config from '../../config';

const theme = 'one-dark-pro';
let highlighter = null;
const createHighlighterCallBacks = [];
createHighlighter({
  themes: [theme],
  langs: [...config.codeLangs, 'text'],
}).then((highlighter0) => {
  highlighter = highlighter0;
  createHighlighterCallBacks.forEach((call) => call());
});

window.__copyCode__ = (ele) => {
  navigator.clipboard.writeText(ele.nextElementSibling.innerText);
  ele.classList.add('code-block-copied');
  clearTimeout(ele.__removeClassTime__);
  ele.__removeClassTime__ = setTimeout(() => {
    ele.classList.remove('code-block-copied');
  }, 1000);
};

let currentFileName = '';
let depthId = 0;
const markTocMap = {};

function renderHightlightCode(text, lang) {
  return highlighter.codeToHtml(text, { theme, lang, transformers: [transformerColorizedBrackets()] });
}

marked.use({
  renderer: {
    heading({ tokens, depth }) {
      const id = `mdDepth${depthId++}`;
      markTocMap[currentFileName].push({ id, name: tokens[0].text, depth });
      const text = this.parser.parseInline(tokens);
      return `<h${depth} id="${id}">${text}<a name="${text}" href="#${text}"></a></h${depth}>`;
    },
    code({ text, lang }) {
      const [language, ...paramString] = lang.split(' ');
      const params = {};
      const paramMatch = paramString.join(' ').match(/(\w+)\s*=\s*('[^']*'|"[^"]*"|[^\s]*)/g);
      if (paramMatch) {
        paramMatch.forEach((p) => {
          const [key, value] = p.split('=');
          if (typeof value == 'string' && `'"`.includes(value[0])) {
            params[key] = value.slice(1, -1);
          } else {
            params[key] = value;
          }
        });
      }
      const langAlias = config.codeLangAlias[language] || language;
      const renderLang = config.codeLangs.includes(langAlias) ? langAlias : 'text';
      return `<div class="code-block language-${langAlias} ${params.title == 'hidden' ? 'code-block-headless' : ''}">
        <div class="code-block-lang">${params.title || langAlias}</div>
        <div class="code-block-copy" onclick="__copyCode__(this)"></div>
        <div class="code-block-content">
        ${renderHightlightCode(text, renderLang)}
        </div>
      </div>`;
    },
  },
});

function renderMark(text, fileName) {
  currentFileName = fileName;
  if (!markTocMap[fileName]) markTocMap[fileName] = [];
  return marked(text);
}

export { markTocMap, renderHightlightCode };
export default function (text, fileName) {
  return new Promise((resolve) => {
    if (highlighter !== null) {
      resolve(renderMark(text, fileName));
    } else {
      createHighlighterCallBacks.push(() => {
        resolve(renderMark(text, fileName));
      });
    }
  });
}
