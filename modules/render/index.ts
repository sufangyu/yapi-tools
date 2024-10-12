import { type Setting } from "../setting";
import magicRender from "./utils/magic-render";
import App from "./app";
import { InterfaceCode } from "./types";

export const render = (() => {
  let destroy: Function;
  return (interfaceCode: InterfaceCode, setting: Setting) => {
    // console.log("渲染UI =>>", code);
    destroy?.();

    destroy = magicRender(new App(interfaceCode, setting), () =>
      document.querySelector("#yapi .caseContainer")
    );
  };
})();
