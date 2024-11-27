var texts = prompt('Indtast/indsæt fordringsIDs adskilt af komma eller linjeskift:', '');
if (!texts) return;
var arr = texts.split(/[\r\n,]+/).map(t => t.trim());
var f = window.frames['main'];
if (!f) { console.error('Frame "main" not found.'); return; }
var i = f.document.querySelector('iframe[name="tabPage"]');
if (!i) { console.error('Iframe "tabPage" not found.'); return; }
var d = i.contentDocument || i.contentWindow.document;
arr.forEach(text => {
  var spans = d.querySelectorAll('span');
  var found = false;
  spans.forEach(span => {
    if (span.textContent.trim() === text) {
      found = true;
      var tr = span.closest('tr');
      if (tr) {
        var checkbox = tr.querySelector('input[type="checkbox"]');
        if (checkbox) {
          checkbox.checked = true;
          var e = new Event('change', { bubbles: true });
          checkbox.dispatchEvent(e);
          console.log('Checked checkbox for "' + text + '"');
        } else {
          console.error('Checkbox not found for "' + text + '"');
        }
      } else {
        console.error('tr not found for "' + text + '"');
      }
    }
  });
  if (!found) {
    console.error('Text "' + text + '" not found.');
  }
});
