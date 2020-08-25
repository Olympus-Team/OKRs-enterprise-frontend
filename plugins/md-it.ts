import hljs from 'highlight.js';
import MarkdownIt from 'markdown-it';
export default (_, inject: any) => {
  inject(
    'md',
    new MarkdownIt({
      highlight(str, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(lang, str).value;
          } catch (__) {}
          return '';
        }
      },
    }),
  );
};
