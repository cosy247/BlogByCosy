import { marked } from 'marked';
import { createHighlighter } from 'shiki';
import { transformerColorizedBrackets } from '@shikijs/colorized-brackets';
import config from '../../config';

const theme = 'one-dark-pro';

const highlighter = await createHighlighter({
  themes: [theme],
  langs: [...config.codeLangs, 'text'],
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
        ${highlighter.codeToHtml(text, {
          theme,
          lang: renderLang,
          transformers: [transformerColorizedBrackets()],
          // decorations: [
          //   {
          //     start: { line: 1, character: 0 },
          //     end: { line: 1, character: 11 },
          //     properties: { class: 'highlighted-word' },
          //   },
          // ],
        })}
        </div>
      </div>`;
    },
  },
});

export { markTocMap };
export default (text, fileName) => {
  currentFileName = fileName;
  markTocMap[fileName] = [];
  return marked(text);
};
