"use strict";
{
    const cfg = HFS.getPluginConfig()
    const fileMatch = HFS.misc.makeMatcher(cfg.filename.replace('.*', '.' + cfg.format))
    const libLoaded = HFS.misc.pendingPromise()

    const renderFetched = {
        html: x => HFS.html(x),
        txt: x => HFS.h('pre', {}, HFS.misc.escapeHTML(x)),
        md: x => libLoaded.then(() => HFS.html(marked.parse(x))),
    }[cfg.format]

    const renderWithoutFetching = !renderFetched && (src => HFS.html(cfg.imageCode.replace('$URL', src)))

    if (cfg.format === 'md')
        HFS.loadScript('marked.min.js').then(libLoaded.resolve)

    HFS.onEvent(cfg.where, () => HFS.h(Show))
    let setRendered // expose setter
    function Show() {
        let [rendered, _setRendered] = HFS.React.useState(null)
        setRendered = _setRendered
        return rendered && HFS.h('div', { id: 'rich-folder-content' }, rendered)
    }

    const load = HFS.debounceAsync(uri =>
            renderWithoutFetching ? new Promise(res => setTimeout(() =>
                    res(setRendered?.(renderWithoutFetching(uri))) ))
                : fetch(uri).then(x => x.text()).then(x => Promise.resolve(renderFetched(x)).then(setRendered)),
        { cancelable: true })
    HFS.watchState('uri', () => {
        load.cancel()
        setRendered?.('')
    })
    HFS.onEvent('entry', ({ entry }) => {
        if (entry.isFolder || !fileMatch(entry.n)) return
        load(entry.n)
        if (cfg.hide) return null
    })

}
