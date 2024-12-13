import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import 'reflect-metadata';
import { type Setting } from '../setting';
import './components/style-code';
import { InterfaceCode } from './types';

@customElement('interface-extension')
class App extends LitElement {
  /**
   * 请求体类型代码
   *
   * @memberof App
   */
  @property({ type: String })
  requestTypeCode = '';

  /**
   * 响应体类型代码
   *
   * @memberof App
   */
  @property({ type: String })
  responseTypeCode = '';

  /**
   * TS 接口信息
   *
   * @type {Partial<InterfaceCode>}
   * @memberof App
   */
  @property({ type: Object })
  interfaceCode: Partial<InterfaceCode> = {};

  /**
   * 配置信息
   *
   * @type {Partial<Setting>}
   * @memberof App
   */
  @property({ type: Object })
  setting: Partial<Setting> = {};

  constructor(interfaceCode: InterfaceCode, setting: Setting) {
    super();
    const { title, pageUrl, requestTypeCode, responseTypeCode } = interfaceCode;

    this.interfaceCode = interfaceCode;
    this.setting = setting;

    this.requestTypeCode = [
      `/**`,
      ` * ${title} 请求参数`,
      ` * @see ${pageUrl}`,
      ` */`,
      `${requestTypeCode}`
    ].join('\n');
    this.responseTypeCode = [
      `/**`,
      ` * ${title} 响应体`,
      ` * @see ${pageUrl}`,
      ` */`,
      `${responseTypeCode}`
    ].join('\n');

    // console.log('============================== 渲染 ==============================');
    // console.log(this.setting);
    // console.log(this.interfaceCode);
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
      border-radius: 6px;
      overflow: hidden;
      margin-bottom: 16px;
    }
    .interface-item-head {
      height: 36px;
      line-height: 36px;
      padding: 0 16px;
      font-size: 14px;
      background-color: #2f343d;
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
      background-color: rgba(255, 255, 255, 0.8);
      padding: 4px 8px;
      line-height: 1em;
      font-size: 12px;
      border: none;
      margin: 0;
      outline: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .interface-copy:hover {
      background-color: #ffffff;
      // box-shadow: 0 0 1px 0 #ffffff;
    }
    .interface-copy:active {
      box-shadow: none;
      background-color: rgba(255, 255, 255, 0.8);
    }
    .interface-code {
      background-color: #171717;
      padding: 16px;
      max-height: 60vh;
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
    const target = ev.target as HTMLElement | null;
    if (!target) {
      return;
    }

    try {
      const key = target?.dataset['key'];
      let copyText = '';
      switch (key) {
        case 'requestTypeCode':
          copyText = this.requestTypeCode ?? '';
          break;
        case 'responseTypeCode':
          copyText = this.responseTypeCode ?? '';
          break;
        case 'requestFunc':
          copyText = this.getRequestFuncStr();
          break;
        case 'mockData':
          copyText = this.interfaceCode.mockData ?? '';
          break;
        default:
          console.warn('未匹配到要复制内容的相应类型');
          break;
      }

      await navigator.clipboard.writeText(copyText);
      target!.innerHTML = '已复制✓';
    } catch (error: any) {
      target!.innerHTML = '复制失败！';
      console.error('复制失败', error);
    }

    setTimeout(() => {
      target!.innerHTML = '复制';
    }, 1250);
  }

  // connectedCallback() {
  //   super.connectedCallback();
  //   console.log(`Yapi-Tools-Extension: Rendering completed!`);
  // }

  /**
   * 获取请求函数字符串
   *
   * @private
   * @return {*}  {string}
   * @memberof App
   */
  private getRequestFuncStr(): string {
    let { method, title, pageUrl, rootNameBase, path, reqParams, reqQuery, reqBody } =
      this.interfaceCode;
    const { interfacePrefix, requestFuncTypes } = this.setting;
    // console.log("interfaceCode", reqParams, reqQuery, reqBody);

    const apiUrl = (path ?? '').replace(/{/g, '${');
    let funcName = interfacePrefix ? rootNameBase?.replace(/^i/i, '') : rootNameBase;
    funcName = lowercaseFirstLetter(funcName ?? '');
    method = method!.toLocaleLowerCase();
    const reqInterface = `${requestFuncTypes ? 'Types.' : ''}${rootNameBase}Req`;
    const resInterface = `${requestFuncTypes ? 'Types.' : ''}${rootNameBase}Res`;

    // // TEST: 需要注释掉
    // reqParams = [
    //   { name: "orderId", desc: "订单ID" },
    //   { name: "userId", desc: "用户ID" },
    // ];

    // Query 参数
    let funcParamsQuery = '';
    let reqQueryStr = '';
    if ((reqQuery ?? []).length > 0) {
      funcParamsQuery = `params: ${reqInterface}`;
      reqQueryStr = 'params';
    }

    // Body 参数
    let funcParamsBody = '';
    let reqBodyStr = '';

    if (reqBody) {
      funcParamsBody = `data: ${reqInterface}`;
      reqBodyStr = 'data';
    }

    // 函数参数（需要处理路径参数情况）
    const reqFuncParamsArr = [funcParamsQuery, funcParamsBody].filter(Boolean);
    if ((reqParams ?? []).length > 0) {
      const reqParamsArr = (reqParams ?? []).map((it) => `${it.name}: string`).filter(Boolean);
      reqFuncParamsArr.unshift(...reqParamsArr);
    }

    // 函数注释中的参数列表
    const reqFuncParamsComments = [
      ...(reqParams ?? []).map((it) => ` * @params {string} ${it.name} ${it.desc || ''}`),
      funcParamsQuery ? ` * @params {${reqInterface}} ${reqQueryStr} ${title}参数` : '',
      funcParamsBody ? ` * @params {${reqInterface}} ${reqBodyStr} ${title}参数` : ''
    ].filter(Boolean).join('\n');

    const requestFuncArr = [
      `/**`,
      ` * ${title}`,
      ` *`,
      reqFuncParamsComments,
      ` * @see ${pageUrl}`,
      ` * @return {*}`,
      ` */`,
      `export const ${funcName}Api = (${reqFuncParamsArr.join(', ')}) => {`,
      `  const url = \`${apiUrl}\`;\n`,
      `  return http.${method}<${resInterface}>({`,
      `    url,`,
      `    ${reqQueryStr ? `${reqQueryStr},` : ''}`,
      `    ${reqBodyStr ? `${reqBodyStr},` : ''}`,
      `    loading: true,`,
      `  })`,
      `};`
    ].filter((item) => item.replace(/[^\S\r\n]/g, '') !== ''); // 过滤空行

    return requestFuncArr.join('\n');
  }

  renderRequestFunc() {
    const { generateRequestFunc } = this.setting;
    const requestFuncStr = this.getRequestFuncStr();

    return generateRequestFunc
      ? html`
          <div class="interface-item">
            <div class="interface-item-head">
              <span>请求函数</span>
              <button @click="${this.handleCodeCopy}" data-key="requestFunc" class="interface-copy">
                复制
              </button>
            </div>
            <div class="interface-item-body">
              <div class="interface-code">
                <style-code code="${requestFuncStr}"></style-code>
              </div>
            </div>
          </div>
        `
      : html``;
  }

  private renderMockData() {
    const { generateMockData } = this.setting;
    const { mockData } = this.interfaceCode;

    return generateMockData
      ? html`
          <div class="interface-item">
            <div class="interface-item-head">
              <span>Mock 数据</span>
              <button @click="${this.handleCodeCopy}" data-key="mockData" class="interface-copy">
                复制
              </button>
            </div>
            <div class="interface-item-body">
              <div class="interface-code" style="max-height: 35vh;">
                <style-code languages="json" code="${mockData}"></style-code>
              </div>
            </div>
          </div>
        `
      : html``;
  }

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

          ${this.renderRequestFunc()} ${this.renderMockData()}
        </div>
      </div>
    `;
  }
}

export default App;
