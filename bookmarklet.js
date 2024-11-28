javascript:(function(){
    var inputIds = prompt('Indtast fordringsIDs adskilt af komma eller linjeskift:', '');
    if (!inputIds) return;
    var ids = inputIds.split(/[\r\n,]+/).map(function(id) { return id.trim(); });
    var totalIds = ids.length;
    var processedCount = 0;

    // Store the original title to restore later
    var originalTitle = document.title || 'My Page';

    function updateProgress() {
        processedCount++;
        var pct = Math.round((processedCount / totalIds) * 100);
        document.title = 'Processing: ' + pct + '% - ' + originalTitle;
    }

    // Access the main frame and the inner iframe
    var f = window.frames['main']; // Frame name
    if (!f) { console.error('Frame "main" not found.'); return; }
    var i = f.document.querySelector('iframe[name="uiMap"]'); // Iframe name
    if (!i) { console.error('Iframe "uiMap" not found.'); return; }
    var d = i.contentDocument || i.contentWindow.document; // Iframe document

    // Locate all td elements containing obligationInfo
    var tds = d.querySelectorAll('td[orafield="obligationInfo"]');
    var foundIds = new Set();

    ids.forEach(function(inputId) {
        var found = false;
        tds.forEach(function(td) {
            var tdText = td.textContent || '';
            if (tdText.includes(inputId)) { // Check if the TD contains the input ID
                found = true;
                foundIds.add(inputId);
                var tr = td.closest('tr');
                if (tr) {
                    var checkbox = tr.querySelector('input[type="checkbox"]');
                    if (checkbox) {
                        checkbox.checked = true;
                        var e = new Event('change', { bubbles: true });
                        checkbox.dispatchEvent(e);
                        console.log('Checkbox for ID "' + inputId + '" has been checked.');
                    } else {
                        console.error('Checkbox not found in tr for ID "' + inputId + '".');
                    }
                } else {
                    console.error('tr element not found for ID "' + inputId + '".');
                }
            }
        });

        if (!found) {
            console.error('ID "' + inputId + '" not found in any td.');
        }

        updateProgress(); // Update progress after each ID
    });

    // Finalize and restore the original title
    document.title = 'Processing complete - ' + originalTitle;
    setTimeout(function() {
        document.title = originalTitle; // Restore the original title after a short delay
    }, 5000); // Adjust the delay as needed

    // Log any IDs that were not found
    ids.forEach(function(id) {
        if (!foundIds.has(id)) {
            console.warn('ID "' + id + '" was not matched and remains unchecked.');
        }
    });
})();
