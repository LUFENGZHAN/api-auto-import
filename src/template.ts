/*eslint-disable*/
// @ts-ignore 
import {App} from "vue";
<%=apiImport%>

export const <%=constApiData%> = <%=apiDate%>;

<%=constApiImport%>
declare global {
    const <%=apiName%>:typeof <%= constApiData %>;
    interface Window {
        <%=apiName%> : typeof <%=constApiData%>;
    }
}
export default {
    install(app:App<Element>){
        app.config.globalProperties.<%= apiName %> = <%=constApiData%>;
        window.<%= apiName %> = <%=constApiData%>;
    }
}
