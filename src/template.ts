/*eslint-disable*/
<% if (is_ts) { %>
// @ts-ignore 
import {App} from "vue";
<% } %>
<%=apiImport%>

export const <%=constApiData%> = <%=apiDate%>;

<%=constApiImport%>
<% if (is_ts) { %>
declare global {
    const <%=apiName%>:typeof <%= constApiData %>;
    <% if (is_ts) { %>
    interface Window {
        <%=apiName%> : typeof <%=constApiData%>;
    }
    <% } %>
}
<% } %>
<% if (is_ts) { %>
<% if (isDefault) { %>
export default <%= constApiData %> 
<% } else {%>
export default {
    install(app:App<Element>){
        app.config.globalProperties.<%= apiName %> = <%=constApiData%>;
        window.<%= apiName %> = <%=constApiData%>;
    },
}<% } %>
<% } else {%>
<% if (isDefault) { %>
export default <%= constApiData %> 
<% } else {%>
export default {
    install(app){
        app.config.globalProperties.<%= apiName %> = <%=constApiData%>;
        window.<%= apiName %> = <%=constApiData%>;
    },
}<% } %>
<% } %>
