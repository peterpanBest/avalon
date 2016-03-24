

function parseDisplay(nodeName, val) {
    //用于取得此类标签的默认display值
    var key = '_' + nodeName
    if (!parseDisplay[key]) {
        var node = document.createElement(nodeName)
        avalon.root.appendChild(node)
        if (avalon.modern) {
            val = getComputedStyle(node, null).display
        } else {
            val = node.currentStyle.display
        }
        avalon.root.removeChild(node)
        parseDisplay[key] = val
    }
    return parseDisplay[key]
}

avalon.parseDisplay = parseDisplay

avalon.directive('visible', {
    parse: function (binding, num) {
        return 'vnode' + num + '.props["ms-visible"] = ' + avalon.parseExpr(binding) + ';\n'
    },
    diff: function (cur, pre) {
        var c = cur.props['ms-visible'] = !!cur.props['ms-visible']
        cur.displayValue = pre.displayValue
        if (c !== pre.props['ms-visible']) {
            var list = cur.change || (cur.change = [])
            avalon.Array.ensure(list, this.update)
        }
    },
    update: function (node, vnode) {
        if (vnode.props['ms-visible']) {
            var cur = avalon(node).css('display')
            if (!vnode.displayValue) {
                vnode.displayValue = cur !== 'none' ? cur :
                        parseDisplay(node.nodeName)
            }
            node.style.display = vnode.displayValue
        } else {
            node.style.display = 'none'
        }
    }
})