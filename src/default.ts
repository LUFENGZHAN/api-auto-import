/*eslint-disable*/
// @ts-ignore 
<%=apiImport%>

export const <%=constApiData%> = <%=apiDate%>;

<%=constApiImport%>
declare global {
    const <%=apiName%>:typeof <%= constApiData %>;
}
export default <%= constApiData %>
