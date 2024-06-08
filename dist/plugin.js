exports.version = 1
exports.description = "Show the content of a file on top of the list"
exports.apiRequired = 8.85 // async loadScript, HFS.html
exports.repo = "rejetto/rich-folder"
exports.frontend_js = 'main.js'
exports.config = {
    where: { frontend: true, type: 'select', defaultValue: 'afterHeader', options: ['afterHeader', 'afterList'] },
    format: { frontend: true, type: 'select', defaultValue: 'html', options: ['html', 'txt', 'md', 'jpg', 'png', 'svg'] },
    filename: { frontend: true, type: 'string', defaultValue: 'readme.*' },
    imageCode: { frontend: true, type: 'string', defaultValue: '<img src="$URL" style="margin: auto; display: block; max-height: 20vh" />',
        multiline: true, helperText: "Only used by image formats"
    },
}

