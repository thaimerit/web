export function filterHtmlUtil(html="") {
    return html ? html
    .replace(/font-family:[^;']*(;)?/g, "")
    .replace(/background-color:[^;']*(;)?/g, "")
    .replace(/font-size:[^;']*(;)?/g, "")
    .replace(/\n/g, "<br />") : ""
}

export function filterHtmlUtilHolystick(html="") {
    return html ? html
    .replace(/font-family:[^;']*(;)?/g, "")
    .replace(/background-color:[^;']*(;)?/g, "")
    .replace(/font-size:[^;']*(;)?/g, "")
    .replace(/color:[^;']*(;)?/g, "")
    .replace(/\n/g, "<br />") : ""
}

export function stripHtml(html)
{
   let tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
}