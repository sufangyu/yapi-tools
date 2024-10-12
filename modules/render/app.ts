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
      ` * ${title} 请求参数类型`,
      ` * @see ${pageUrl}`,
      ` */`,
      `${requestTypeCode}`
    ].join('\n');
    this.responseTypeCode = [
      `/**`,
      ` * ${title} 响应体类型`,
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
        default:
          break;
      }

      await navigator.clipboard.writeText(copyText);
      alert('已复制到剪切板！');
    } catch (error: any) {
      alert(`复制失败：${error.message as string}`);
    }
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

    const pathRes = (path ?? '').replace(/{/g, '${');
    const funcName = interfacePrefix ? rootNameBase?.replace(/^i/i, '') : rootNameBase;
    const funcNameRes = lowercaseFirstLetter(funcName ?? '');
    const methodRes = method!.toLocaleLowerCase();
    const reqInterfaceName = `${requestFuncTypes ? 'Types.' : ''}${rootNameBase}Req`;
    const resInterfaceName = `${requestFuncTypes ? 'Types.' : ''}${rootNameBase}Res`;

    // // TEST: 需要注释掉
    // reqParams = [
    //   { name: "orderId", desc: "订单ID" },
    //   { name: "userId", desc: "用户ID" },
    // ];

    // Query 参数
    let funcParamsQuery = '';
    let reqQueryStr = '';
    if ((reqQuery ?? []).length > 0) {
      funcParamsQuery = `params: ${reqInterfaceName}`;
      reqQueryStr = 'params';
    }

    // Body 参数
    let funcParamsBody = '';
    let reqBodyStr = '';

    if (reqBody) {
      funcParamsBody = `data: ${reqInterfaceName}`;
      reqBodyStr = 'data';
    }

    // 函数参数（需要处理路径参数情况）
    const reqFuncParamsArr = [funcParamsQuery, funcParamsBody].filter(Boolean);
    if ((reqParams ?? []).length > 0) {
      const reqParamsArr = (reqParams ?? []).map((it) => `${it.name}: string`).filter(Boolean);
      reqFuncParamsArr.unshift(...reqParamsArr);
    }

    // 函数注释中的参数列表
    const reqFuncParamsCommentsArr = [
      ...(reqParams ?? []).map((it) => `@params {string} ${it.name} ${it.desc || ''}`),
      funcParamsQuery ? `@params {${reqInterfaceName}} ${reqQueryStr} ${title}参数` : '',
      funcParamsBody ? `@params {${reqInterfaceName}} ${reqBodyStr} ${title}参数` : ''
    ].filter(Boolean);

    const requestFuncArr = [
      `/**`,
      ` * ${title}`,
      ` *`,
      `${reqFuncParamsCommentsArr.map((it) => ` * ${it}`).join('\n')}`,
      ` * @see ${pageUrl}`,
      ` * @return {*}`,
      ` */`,
      `export const ${funcNameRes}Api = (${reqFuncParamsArr.join(', ')}) => {`,
      `  const url = \`${pathRes}\`;`,
      `  return http.${methodRes}<${resInterfaceName}>({`,
      `    url,`,
      `    ${reqQueryStr ? `${reqQueryStr},` : ''}`,
      `    ${reqBodyStr ? `${reqBodyStr},` : ''}`,
      `    loading: true,`,
      `  })`,
      `};`
    ].filter((item) => item.replace(/\s+/g, '') !== ''); // 过滤空行

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

          ${this.renderRequestFunc()}
        </div>
      </div>
    `;
  }
}

export default App;
