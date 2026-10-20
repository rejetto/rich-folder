const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')
const { test } = require('node:test')

const source = fs.readFileSync(`${__dirname}/../dist/public/main.js`, 'utf8')

test('renders encoded plain text and reapplies visibility after a list reload', async () => {
    const events = {}
    const watches = {}
    let fetched
    let rendered
    let belongs = true
    const context = {
        fetch: async uri => {
            fetched = uri
            return { text: async () => '<tag>&' }
        },
        HFS: {
            React: { useState: () => [null, value => { rendered = value }] },
            debounceAsync: fn => Object.assign(fn, { cancel() {} }),
            getPluginConfig: () => ({ filename: 'readme.*', format: 'txt', where: 'afterHeader', hide: true, visibleTo: ['u'] }),
            h: (type, props, ...children) => typeof type === 'function' ? type() : ({ type, children }),
            html: value => value,
            misc: {
                makeMatcher: () => () => true,
                pendingPromise: () => ({}),
                escapeHTML: value => value.replaceAll('<', '&lt;').replaceAll('&', '&amp;'),
            },
            onEvent: (name, callback) => { events[name] = callback },
            userBelongsTo: () => belongs,
            watchState(name, callback) { watches[name] = callback },
        },
        setTimeout,
    }
    vm.runInNewContext(source, context)
    events.afterHeader()
    const entries = [{ n: 'read#me.txt', uri: '/folder/read%23me.txt' }]
    events.newListEntries({ entries })
    await new Promise(setImmediate)

    assert.equal(fetched, '/folder/read%23me.txt')
    assert.equal(rendered.children[0], '<tag>&')
    assert.equal(entries.length, 1)

    belongs = false
    watches.loading(true)
    const reloadedEntries = [{ n: 'read#me.txt', uri: '/folder/read%23me.txt' }]
    events.newListEntries({ entries: reloadedEntries })
    assert.equal(reloadedEntries.length, 0)
})
