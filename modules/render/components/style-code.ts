import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-json';

@customElement('style-code')
class StyleCode extends LitElement {
  @property()
  code = '';

  @property()
  language = 'typescript';

  static styles = css`
    .style-code {
      color: #80ffea;
      margin: 0;
    }
    .token.keyword {
      color: #ff80bf;
    }
    .token.class-name {
      color: #8aff80;
    }
    .token.comment {
      color: #7970a9;
    }
    .token.punctuation {
      color: #ffffff;
    }
    .token.operator {
      color: #ff80bf;
    }
    .token.builtin {
      color: #ffffff;
    }

    .token.string {
      color: #ffd580;
    }
    .token.number {
      color: #7970a9;
    }
    .token.boolean {
      color: #f5ab35;
    }
  `;

  private highlight(code: string) {
    let htmlCode = '';
    switch (this.language) {
      case 'typescript':
        htmlCode = Prism.highlight(code, Prism.languages.typescript, 'typescript');
        break;
      case 'json':
        htmlCode = Prism.highlight(code, Prism.languages.json, 'json');
        break;
      default:
        htmlCode = code;
        break;
    }

    return unsafeHTML(htmlCode);
  }

  render() {
    return html`<pre class="style-code"><code>${this.highlight(this.code)}</code></pre>`;
  }
}
export default StyleCode;
