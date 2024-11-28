javascript:(function() {
    var inputIds = prompt('Indtast fordringsIDs adskilt af komma eller linjeskift:', '');
    if (!inputIds) return;

    var ids = inputIds.split(/[\r\n,]+/).map(function(id) {
        return id.trim();
    });
    var totalIds = ids.length;
    var processedCount = 0;
    var originalTitle = document.title || 'My Page';

    function updateProgress() {
        processedCount++;
        var pct = Math.round((processedCount / totalIds) * 100);
        document.title = 'Markerer1: ' + pct + '% - ' + originalTitle;
    }

    var f = window.frames['main']; // Framename
    if (!f) {
        console.error('Frame "main" not found.');
        return;
    }

    var i = f.document.querySelector('iframe[name="uiMap"]'); // Iframename
    if (!i) {
        console.error('Iframe "uiMap" not found.');
        return;
    }

    var d = i.contentDocument || i.contentWindow.document; // Iframe document
    var tds = d.querySelectorAll('td[orafield="obligationInfo"]');
    var foundIds = new Set();

    ids.forEach(function(inputId) {
        var found = false;
        tds.forEach(function(td) {
            var tdText = td.textContent || '';
            if (tdText.includes(inputId)) {
                found = true;
                foundIds.add(inputId);

                var tr = td.closest('tr');
                if (tr) {
                    var checkbox = tr.querySelector('input[type="checkbox"]');
                    if (checkbox) {
                        checkbox.checked = true;
                        var e = new Event('change', { bubbles: true });
                        checkbox.dispatchEvent(e);
                    } else {
                        console.error('Checkbox not found in tr for ID "' + inputId + '".');
                    }
                } else {
                    console.error('tr element not found for ID "' + inputId + '".');
                }
            }
        });

        updateProgress();
    });

    document.title = 'Markering færdig - ' + originalTitle;

    setTimeout(function() {
        document.title = originalTitle; // Restore the original title
    }, 5000);
})();
