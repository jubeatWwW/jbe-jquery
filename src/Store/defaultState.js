export default {
    currentId: 0,
    lines: [{
        id: 0,
        nodes: [{
            text: '',
            style: {}
        }]
    }],
    caret: {
        x: 0,
        y: 0,
        cx: 0,
        cy: 0,
        block: 0
    },
    range: {
        isCollapsed: true,
        sx: -1,
        sy: -1,
        sb: -1,
        ex: -1,
        ey: -1,
        eb: -1,
    }
}
