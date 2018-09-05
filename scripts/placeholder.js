module.exports = function () {
    var inputs = document.getElementsByTagName('input');
    var supportPlaceholder = 'placeholder' in document.createElement('input');
    var type, placeholder;
    for (var i = 0; i < inputs.length; i++) {
        var _input = inputs[i];
        type = _input.getAttribute('type') || '';
        placeholder = _input.getAttribute('placeholder') || '';
        if (!supportPlaceholder && (type === 'text' || type === 'number') && placeholder !== '') {
            var h = _input.offsetHeight;
            var w = _input.offsetWidth;
            var l = _input.offsetLeft;
            var parent = _input.parentNode;
            var childs = parent.childNodes;
            var isExist = false;
            (function (k) {
                for (var j = 0; j < childs.length; j++) {
                    if (childs[j].id === 'placeholder_' + k) {
                        isExist = true;
                        childs[j].innerHTML = placeholder;
                        break;
                    }
                }
            })(i);
            if (isExist) {
                return;
            }
            var s = document.createElement('span');
            var styles = 'display:block;width:' + w + 'px;line-height:' + h + 'px;color: #666;position:absolute;left:' + l + 'px;top:0;background:white;';
            s.id = 'placeholder_' + i;
            s.setAttribute('style', styles);
            s.innerHTML = placeholder;
            parent.setAttribute('style','position:relative;');
            parent.appendChild(s);

            bindEvent(s, 'click', function (e) {
                e.style.display = 'none';
                _input.focus();
            });
            bindEvent(_input, 'blur', function (e) {
                var target = e.target || e.srcElement;
                var value = target.value || '';
                var pl = target.getAttribute('placeholder');
                if (value === '') {
                    s.style.display = 'block';
                } else {
                    s.style.display = 'none';
                }
            });
        }
    }

    function bindEvent(el, type, cb) {
        if (window.addEventListener) {
            el.addEventListener(type, cb, false);
        } else {
            el.attachEvent('on' + type, cb);
        }
    }
}