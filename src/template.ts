/*eslint-disable*/
// @ts-ignore
<%=apiImport%>;

export const <%=%> = <%=dataApi%>;


export default {
    install(app:App<Element>){
        app.config.globalProperties.$<%= constApiData %> = <%=dataApi%>;
        window.$<%= constApiData %> = <%=dataApi%>;
    }
}
declare global {
    const <%= apis %>:typeof <%= constApiData %>;
}
