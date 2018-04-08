var copyHandle = function(select, author, entryUrl) {
    function init(e) {
        var clipText = getClipText();
        if (clipText.length > 100) {
            var after = clipText.length < 500,
                o = htmlStyle(after, clipText),
                a = textStyle(after, clipText);

            if ('object' === typeof e.originalEvent.clipboardData && (e.originalEvent.clipboardData.setData('text/html', o), e.originalEvent.clipboardData.setData('text/plain', a), 0 < e.originalEvent.clipboardData.getData('text/plain').length)) {
                e.preventDefault();
                return;
            }
        }
    }
    function getClipText() {
        var text = '';
        if (window.getSelection) {
            text = window.getSelection().toString();

        } else if (window.document.selection && 'Control' !== window.document.selection.type) {
            text = window.document.selection.createRange().text;
        }

        return text;
    }
    function copyRight(after, text) {
        var a1 = ['著作权归作者所有。', '商业转载请联系作者获得授权，非商业转载请注明出处。', '作者：' + author, '链接：' + entryUrl, '来源：知乎'],
            a2 = ['', ''],
            a3 = [text];

         return after ? a3.concat(a2, a1) : a1.concat(a2, a3);
    }
    function htmlStyle(after, text) {
        return '\x3cdiv\x3e' + copyRight(after, text).join('\x3cbr /\x3e'); + '\x3c/div\x3e';
    }
    function textStyle(after, text) {
        return copyRight(after, text).join('\n');
    }
    if (entryUrl.indexOf('http') === -1) {
        entryUrl = window.location.protocol + '//' + window.location.host + entryUrl;
    }
    select && author && entryUrl && $(select).on('copy', init);
}