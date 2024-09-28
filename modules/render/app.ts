import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import "reflect-metadata";
import "./components/style-code";
import { InterfaceCode } from "./types";

@customElement("interface-extension")
class App extends LitElement {
  @property({ type: String })
  method = "";

  @property({ type: String })
  title = "";

  @property({ type: String })
  path = "";

  @property({ type: String })
  pageUrl = "";

  @property({ type: String })
  requestTypeCode = "";

  @property({ type: String })
  responseTypeCode = "";

  constructor(interfaceCodeStr: InterfaceCode) {
    super();
    const { method, title, path, pageUrl, requestTypeCode, responseTypeCode } =
      interfaceCodeStr;

    this.method = method;
    this.title = title;
    this.path = path;
    this.pageUrl = pageUrl;
    this.requestTypeCode = [
      `/**`,
      ` * ${title} 请求参数类型`,
      ` * @see ${pageUrl}`,
      ` */`,
      `${requestTypeCode}`,
    ].join("\n");
    this.responseTypeCode = [
      `/**`,
      ` * ${title} 响应体类型`,
      ` * @see ${pageUrl}`,
      ` */`,
      `${responseTypeCode}`,
    ].join("\n");

    // console.log(
    //   "============================== 渲染 =============================="
    // );
    // console.log(this.method);
    // console.log(this.title);
    // console.log(this.path);
    // console.log(this.pageUrl);
    // console.log(this.requestTypeCode);
    // console.log(this.responseTypeCode);
  }

  static styles = css`
    .interface {
      float: left;
      width: 100%;
    }
    .interface-head {
      font-weight: 400;
      margin-bottom: 30px;
      border-left: 3px solid #2395f1;
      padding-left: 8px;
      color: rgba(39, 56, 72, 0.85);
    }
    .interface-body {
      padding: 0 16px;
      position: relative;
    }
    .interface-item {
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 16px;
    }
    .interface-item-head {
      height: 36px;
      line-height: 36px;
      padding: 0 16px;
      font-size: 14px;
      background-color: #32363a;
      color: #999;
      border-bottom: 1px solid #333;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .interface-item-body {
      position: relative;
    }
    .interface-copy {
      // position: absolute;
      background-color: rgba(255, 255, 255, 0.8);
      padding: 5px 10px;
      line-height: 1em;
      font-size: 13px;
      // top: 10px;
      // right: 30px;
      border: none;
      margin: 0;
      outline: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .interface-copy:hover {
      background-color: #ffffff;
      box-shadow: 0 0 1px 0 #ffffff;
    }
    .interface-copy:active {
      box-shadow: none;
      background-color: rgba(255, 255, 255, 0.8);
    }
    .interface-code {
      background-color: #2f2f2f;
      padding: 16px;
      max-height: 80vh;
      overflow-y: auto;
      overscroll-behavior: contain;
    }
    .interface-code::-webkit-scrollbar {
      width: 6px;
      height: 6px;
      background-color: transparent;
    }
    .interface-code::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background-color: rgba(255, 255, 255, 0.5);
    }
  `;

  async handleCodeCopy(ev: Event) {
    try {
      const target = ev.target as HTMLElement | null;
      const key = target?.dataset["key"] as keyof InterfaceCode;
      const text = this[key];
      await navigator.clipboard.writeText(text);
      alert("已复制到剪切板！");
    } catch (error: any) {
      alert(`复制失败：${error.message as string}`);
    }
  }

  // connectedCallback() {
  //   super.connectedCallback();
  //   console.log(`Yapi-Tools-Extension: Rendering completed!`);
  // }

  render() {
    return html`
      <div class="interface">
        <h2 class="interface-head">类型定义</h2>
        <div class="interface-body">
          <div class="interface-item">
            <div class="interface-item-head">
              <span>参数类型</span>
              <button
                @click="${this.handleCodeCopy}"
                data-key="requestTypeCode"
                class="interface-copy"
              >
                复制
              </button>
            </div>
            <div class="interface-item-body">
              <div class="interface-code">
                <style-code code="${this.requestTypeCode}"></style-code>
              </div>
            </div>
          </div>

          <div class="interface-item">
            <div class="interface-item-head">
              <span>响应类型</span>
              <button
                @click="${this.handleCodeCopy}"
                data-key="responseTypeCode"
                class="interface-copy"
              >
                复制
              </button>
            </div>
            <div class="interface-item-body">
              <div class="interface-code">
                <style-code code="${this.responseTypeCode}"></style-code>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

export default App;
