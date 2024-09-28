import magicRender from "./utils/magic-render";
import App from "./app";
import { InterfaceCode } from "./types";

export const render = (() => {
  let destroy: Function;
  return (interfaceCode: InterfaceCode) => {
    // console.log("渲染UI =>>", code);
    destroy?.();

    destroy = magicRender(new App(interfaceCode), () =>
      document.querySelector("#yapi .caseContainer")
    );
  };
})();
