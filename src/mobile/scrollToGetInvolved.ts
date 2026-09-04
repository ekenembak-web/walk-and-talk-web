/** Jump to #get-involved (on the Explore page), retrying until it mounts. */
export function scrollToGetInvolved(tries = 0) {
  const el = document.getElementById("get-involved");
  if (el) {
    window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - 8, behavior: "auto" });
  } else if (tries < 20) {
    requestAnimationFrame(() => scrollToGetInvolved(tries + 1));
  }
}
