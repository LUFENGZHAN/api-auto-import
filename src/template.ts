/*eslint-disable*/
// @ts-ignore
<%=apiImport%>;

export const <%=constApiData%> = <%=dataApi%>;


declare global {
    interface Window {
        $<%=constApiData=>: typeof <%=dataApi%>;
    }
}
export default {
    install(app:App<Element>){
        app.config.globalProperties.$<%= constApiData %> = <%=dataApi%>;
        window.$<%= constApiData %> = <%=dataApi%>;
    }
}
declare global {
    const $<%= constApiData %>:typeof <%= constApiData %>;
}
