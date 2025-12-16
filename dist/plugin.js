exports.version = 1.13
exports.description = "Show the content of a file on top of the list. With this plugin you can mimic GitHub in showing README.md when you enter a folder."
exports.apiRequired = 8.9 // new debounceAsync api. "showIf" can be considered optional
exports.repo = "rejetto/rich-folder"
exports.frontend_js = 'main.js'
exports.frontend_css = 'style.css'
exports.changelog = [
    { "version": 1.13, "message": "fix: crash when a folder matches the filename mask" }
]
exports.config = {
    where: { frontend: true, type: 'select', defaultValue: 'afterHeader', options: ['afterHeader', 'afterList'], sm: 6 },
    format: { frontend: true, type: 'select', defaultValue: 'html', options: ['html', 'txt', 'md', 'jpg', 'png', 'svg'], sm: 6 },
    filename: { frontend: true, type: 'string', defaultValue: 'readme.*', sm: 6 },
    hide: { frontend: true, type: 'boolean', label: "Hide the file from the list", sm: 6 },
    imageCode: { frontend: true, type: 'string', defaultValue: '<img src="$URL" style="margin: auto; display: block; max-height: 20vh" />',
        multiline: true, showIf: values => ['jpg','png','svg'].includes(values.format),
    },
}
