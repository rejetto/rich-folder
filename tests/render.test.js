const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')
const { test } = require('node:test')

const source = fs.readFileSync(`${__dirname}/../dist/public/main.js`, 'utf8')

test('fetches the encoded URI and lets React escape plain text', async () => {
    const events = {}
    let fetched
    let rendered
    const context = {
        fetch: async uri => {
            fetched = uri
            return { text: async () => '<tag>&' }
        },
        HFS: {
            React: { useState: () => [null, value => { rendered = value }] },
            debounceAsync: fn => Object.assign(fn, { cancel() {} }),
            getPluginConfig: () => ({ filename: 'readme.*', format: 'txt', where: 'afterHeader' }),
            h: (type, props, ...children) => typeof type === 'function' ? type() : ({ type, children }),
            html: value => value,
            misc: {
                makeMatcher: () => () => true,
                pendingPromise: () => ({}),
                escapeHTML: value => value.replaceAll('<', '&lt;').replaceAll('&', '&amp;'),
            },
            onEvent: (name, callback) => { events[name] = callback },
            userBelongsTo: () => false,
            watchState() {},
        },
        setTimeout,
    }
    vm.runInNewContext(source, context)
    events.afterHeader()
    events.newListEntries({ entries: [{ n: 'read#me.txt', uri: '/folder/read%23me.txt' }] })
    await new Promise(setImmediate)

    assert.equal(fetched, '/folder/read%23me.txt')
    assert.equal(rendered.children[0], '<tag>&')
})
