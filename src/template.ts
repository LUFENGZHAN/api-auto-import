/*eslint-disable*/
<% if (is_ts && !isDefault) { %>
// @ts-ignore 
import {App} from "vue";
<% } %>
<%=apiImport%>

export const <%=constApiData%> = <%=apiDate%>;
<% if (is_export) { %>
<%=constApiImport%>
<% } %>
<% if (is_ts) { %>
declare global {
    const <%=apiName%>:typeof <%= constApiData %>;
    <% if (isDefault && isWindow || isWindow) { %>
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
        <% if (isWindow) { %>
        window.<%= apiName %> = <%=constApiData%>;
        <% } %>
    },
}<% } %>
<% } else {%>
<% if (isDefault) { %>
export default <%= constApiData %> 
<% } else {%>
export default {
    install(app){
        app.config.globalProperties.<%= apiName %> = <%=constApiData%>;
        <% if (isWindow) { %>
            window.<%= apiName %> = <%=constApiData%>;
            <% } %>
    },
}<% } %>
<% } %>
