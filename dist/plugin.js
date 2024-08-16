exports.version = 1.11
exports.description = "Show the content of a file on top of the list. With this plugin you can mimic GitHub in showing README.md when you enter a folder."
exports.apiRequired = 8.9 // new debounceAsync api
exports.repo = "rejetto/rich-folder"
exports.frontend_js = 'main.js'
exports.config = {
    where: { frontend: true, type: 'select', defaultValue: 'afterHeader', options: ['afterHeader', 'afterList'], sm: 6 },
    format: { frontend: true, type: 'select', defaultValue: 'html', options: ['html', 'txt', 'md', 'jpg', 'png', 'svg'], sm: 6 },
    filename: { frontend: true, type: 'string', defaultValue: 'readme.*', sm: 6 },
    hide: { frontend: true, type: 'boolean', label: "Hide the file from the list", sm: 6 },
    imageCode: { frontend: true, type: 'string', defaultValue: '<img src="$URL" style="margin: auto; display: block; max-height: 20vh" />',
        multiline: true, helperText: "Only used by image formats"
    },
}

