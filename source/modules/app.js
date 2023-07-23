// Github: https://github.com/DosX-dev/braux

const visual = {
    themes: {
        dark: 'styles/themes/dark.css',
        light: 'styles/themes/light.css',
        cherry: 'styles/themes/cherry.css',
        hacker: 'styles/themes/hacker.css'
    },
    installTheme(theme) {
        visual.setTheme(theme);
        localStorage.setItem('console-theme', theme);
    },
    setTheme(theme) {
        const linkId = 'theme-link',
            link = document.getElementById(linkId);

        if (link) {
            link.href = theme;
        } else {
            const newLink = document.createElement('link');
            newLink.id = linkId;
            newLink.rel = 'stylesheet';
            newLink.href = theme;
            document.head.appendChild(newLink);
        }
    },
    loadTheme() {
        const theme = localStorage.getItem('console-theme');
        if (theme) {
            visual.setTheme(theme);
        } else {
            const preferredTheme = window.matchMedia &&
                window.matchMedia('(prefers-color-scheme: dark)').matches ? visual.themes.dark : visual.themes.light;
            visual.installTheme(preferredTheme);
        }
    }
}

visual.loadTheme();
document.getElementById('version-info').innerText = `version ${config.version}`;

Object.entries({
    "app-default-config": "0",
    "app-prompt": navigator.userAgent
}).forEach(([key, value]) => {
    setDefaultPromptValue(key, value);
});

const commandInput = document.getElementById("commandInput");
const isWelcomeHiddenKey = 'isWelcomeHidden';

function isWelcomeHidden() {
    return localStorage.getItem(isWelcomeHiddenKey);
}

var commandHistory = [],
    currentCommandIndex = -1;



const userProfile = {
    name: {
        key: 'user',
        defaultName: 'user',
        get() {
            const userNameValue = localStorage.getItem(userProfile.name.key);

            if (userNameValue) {
                return userNameValue;
            } else {
                this.set(this.defaultName);
                return this.defaultName;
            }
        },
        set(newUserName) {

            if (newUserName.length < 1) {
                console.error('Username cannot be empty.');
                return;
            } else if (!/^[a-zA-Z0-9]+$/.test(newUserName)) {
                console.error('Invalid characters.');
                return;
            }

            localStorage.setItem(userProfile.name.key, newUserName.toLowerCase());
        }
    }
};

function replaceTagsWithEntities(text) {
    return replacedText = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function setFocus() {
    if (window.getSelection().toString() == '' && commandInput !== document.activeElement) {
        commandInput.focus();
    }
}

async function getIpInfo(ip = '') {
    const response = await fetch('https://freeipapi.com/api/json/' + ip, {
        method: 'GET'
    });

    const data = await response.json();

    const processedData = Object.entries(data)
        .map(([key, value]) => `<b>${key}</b>: ${value}`)
        .join('\n');

    return processedData + '\n<b>apiUsed</b>: freeipapi.com';
}

function wrapFirstWord(sentence) {
    var words = sentence.split(' ');

    if (words.length === 0) {
        return '';
    }

    words[0] = `<span class="first">${words[0]}</span>`;

    return words.join(' ');
}

window.onerror = function(message, source, lineno, colno, error) {
    console.error(`[APP]: ${message}`);
};

function autoScroll() {
    window.scrollTo(0, document.body.scrollHeight);
}

function pushCommand(command, displayCommand = true, sudo = false) {
    var consoleDiv = document.getElementById('console'),
        output = document.createElement('div');
    if (displayCommand) {
        commandInput.placeholder = '';
        output.classList.add('out');
        output.innerHTML = '<span class="pointer">&gt; </span><span class="command">' + wrapFirstWord(replaceTagsWithEntities(command)) + '</span>';
        consoleDiv.appendChild(output);
    }

    function executeAsRoot(callback) {
        if (sudo) {
            callback();
        } else {
            error('You do not have permission to execute this command.');
            out(`Try '<u><span class="insert-cmd">sudo ${command}</span></u>' (click to insert)`);
        }
    }

    function getAllCommandArguments(array) {
        let out = '';
        for (let i = 1; i < array.length; i++) {
            out += array[i] + (i == array.length - 1 ? '' : ' ');
        }
        return out;
    }

    function out(text) {
        let outStd = document.createElement('div');
        ['out', 'log'].forEach(outClass => {
            outStd.classList.add(outClass);
        });
        outStd.innerHTML = text;
        consoleDiv.appendChild(outStd);
        autoScroll();
    }

    function error(text) {
        out(`<span class="error">${text}</span>`);
        let lastCommands = document.getElementsByClassName("command"),
            lastCommand = lastCommands[lastCommands.length - 1];
        lastCommand.style = 'color: rgba(255, 79, 79);';
        lastCommand.innerHTML += '<span style="color: gray;"> (!)</span>';
        autoScroll();
    }

    console.error = error;
    console.log = console.info = console.warn = out;

    console.clear = () => pushCommand("clear");

    const commandArgs = command.trim().split(' ');

    switch (commandArgs[0]) {
        case 'help':
            out(`<span class="insert-cmd">help</span> - show this message
<span class="insert-cmd">clear</span> - clear console
<span class="insert-cmd">theme</span> [name] - change theme
<span class="insert-cmd">echo</span> [html] - format and write text in console
<span class="insert-cmd">ipinfo</span> [ip] - get info about IP (no domains support)
<span class="insert-cmd">history</span> - get a log of commands entered
<span class="insert-cmd">fingerprint</span> - get client information
<span class="insert-cmd">clear</span> - clear console

<span class="insert-cmd">sudo [command]</span> - execute command as root
<span class="insert-cmd">about</span> - get info about application
<span class="insert-cmd">reboot</span> - restart the application
<span class="insert-cmd">exit</span> - exit from the application

* <span class="insert-cmd">js</span> [code] - execute JavaScript (unsafe)
* <span class="insert-cmd">factory-reset</span> - reset all application data settings
`);
            break;



        case 'clear':
            consoleDiv.innerText = '';
            out("<i>Console cleared.</i>");
            break;



        case 'exit':
            out('Goodbye!');
            setTimeout(function() {
                window.location.href = 'about:blank';
            }, 300);
            break;



        case 'echo':
            out(getAllCommandArguments(commandArgs))
            break;



        case 'fingerprint':
            out(fingerprint());
            break;



        case 'factory-reset':
            executeAsRoot(() => {
                localStorage.clear();
                out(`All data of '${document.domain}' erased`);
                setTimeout(() => {
                    pushCommand('reboot', false);
                }, 750);
            });
            break;



        case 'history':
            switch (commandArgs[1]) {
                case 'clear':
                    clearCommandHistory();
                    out('Command history cleared.');
                    break;
                case 'list':
                    out(getCommandHistory());
                    break;
                default:
                    out(`Arguments:
 * list (get history as numbered list)
 * clear (clear history)

Usage: <span class="insert-cmd">history list</span>`)
            }
            break;



        case 'theme':
            let isSeccuss = true;
            switch (commandArgs[1]) {
                case 'dark':
                    visual.installTheme(visual.themes.dark);
                    break;
                case 'light':
                    visual.installTheme(visual.themes.light);
                    break;
                case 'cherry':
                    visual.installTheme(visual.themes.cherry);
                    break;
                case 'hacker':
                    visual.installTheme(visual.themes.hacker);
                    break;
                default:
                    isSeccuss = false;
                    out(`Themes:
 * dark
 * light
 * cherry
 * hacker

Usage: <span class="insert-cmd">theme dark</span>`);
            }
            if (isSeccuss) {
                out(`Theme installed: ${commandArgs[1]}`);
            }
            break;



        case 'ipinfo':
            out('Requesting...');
            getIpInfo(commandArgs[1])
                .then(dataString => {
                    out(dataString);
                })
                .catch(error => {
                    error('No API access');
                });
            break;



        case 'js':
            executeAsRoot(() => {
                let codeToExec = getAllCommandArguments(commandArgs);

                if (codeToExec.trim() == '') {
                    error('Empty source!');
                } else {
                    try {
                        out(`<span style="color: gray;"><span class="pointer">&lt; </span>${eval(codeToExec)}<span>`);
                    } catch (exc) {
                        error(`[VM]: ${exc}`);
                    }
                }
            });
            break;



        case 'about':
            out(` OS:       ${version.os}
 Kernel:   ${version.kernel}
 Shell:    ${version.shell}`);
            break;



        case 'reboot':
            out('Rebooting...');
            setTimeout(() => {
                location.reload();
            }, 300);
            break;



        case 'su':
            error(`You can only use '<span class="insert-cmd">sudo</span>'`);
            break;



        case 'sudo':
            let commandToExecute = getAllCommandArguments(commandArgs);
            if (commandToExecute.trim() == '') {
                out(`Usage: sudo [command]`)
            }
            pushCommand(commandToExecute, false, true);
            break;



        case 'remove-intro':
            localStorage.setItem(isWelcomeHiddenKey, String(true))
            break;



        case 'python': // Yes, I hate python
            error('Do not embarrass yourself.');
            break;



        case '': // Empty prompt
            break;
        case '#': // Comment
            break;
        default:
            error(`Command or packet '<u>${commandArgs[0]}</u>' not found!`);
    }
    autoScroll();
}

function pushCommandScript(command, sudo = false) {
    command.split('\n').forEach(element => {
        pushCommand(element, false, sudo);
    });
}

pushCommand(`echo Welcome, ${userProfile.name.get()}!`, false);

if (isWelcomeHidden() !== String(true)) {
    pushCommand('echo ' +
        `+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
<b>Braux</b> is a unique console system built on browser-based client tools.
It combines ease of use with powerful features, giving you a Unix-like
command line with a choice of different themes and color schemes.

GitHub -> <a target="_blank" href="https://github.com/DosX-dev/braux">https://github.com/DosX-dev/braux</a>
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
Use '<u><span class="insert-cmd">remove-intro</span></u>' to remove this message`, false);
}

function setDefaultPromptValue(name, defaultValue) {
    const urlParams = new URLSearchParams(window.location.search);
    if (!urlParams.has(name)) {
        let locationBarSections = document.URL.split('/'),
            locationBarLastSection = locationBarSections[locationBarSections.length - 1],
            separator = locationBarLastSection.includes('?') ? '&' : '?',
            newUrl = `${window.location.href + separator + name}=${defaultValue}`;
        history.pushState({ path: newUrl }, '', newUrl);
    }
}

// load history form localStorage
const storedHistory = localStorage.getItem("history");
if (storedHistory) {
    commandHistory = JSON.parse(storedHistory);
    currentCommandIndex = commandHistory.length;
}

commandInput.addEventListener("keydown", (event) => {
    switch (event.keyCode) {
        case 13: // Enter
            let command = commandInput.value.trim();
            if (command !== '') {
                if (commandHistory.length === 0 || command !== commandHistory[commandHistory.length - 1]) {
                    commandHistory.push(command);
                }
                currentCommandIndex = commandHistory.length;

                // save history in localStorage
                localStorage.setItem("history", JSON.stringify(commandHistory));
            }
            break;
        case 38: // Up
            event.preventDefault();
            if (currentCommandIndex > 0) {
                currentCommandIndex--;
                commandInput.value = commandHistory[currentCommandIndex];
            }
            break;
        case 40: // Down
            event.preventDefault();
            if (currentCommandIndex < commandHistory.length - 1) {
                currentCommandIndex++;
                commandInput.value = commandHistory[currentCommandIndex];
            } else {
                currentCommandIndex = commandHistory.length;
                commandInput.value = '';
            }
            break;
        default:
            break;
    }
});


function getCommandHistory() {
    return commandHistory.map((command, index) => `${index + 1}. <span class="insert-cmd">${command}</span>`).join("\n");
}

function clearCommandHistory() {
    commandHistory = [];
    currentCommandIndex = 0;
    localStorage.removeItem("history");
}

document.addEventListener('DOMContentLoaded', () => {
    commandInput.addEventListener('keypress', function(event) {
        if (event.keyCode === 13) { // Enter
            event.preventDefault();
            pushCommand(commandInput.value.trim());
            commandInput.value = '';
        }
    });
});

setInterval(() => {
    setFocus()
}, 500);

document.addEventListener('click', (event) => {
    if (event.target.classList.contains('insert-cmd')) {
        commandInput.value = event.target.textContent;
    }
});