// Simple script to highlight current page in navigation
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname;
    const navLinks = document.querySelectorAll('#nav-links a');

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('current');
        } else {
            link.classList.remove('current');
        }
    });

    // Ensure the scroll panel height is properly set
    function adjustLayout() {
        const header = document.querySelector('.header');
        const scrollPanel = document.querySelector('.scroll-panel');
        if (!header || !scrollPanel) return;
        const headerHeight = header.offsetHeight;
        scrollPanel.style.maxHeight = `calc(100vh - ${headerHeight}px - 4rem)`;
    }

    adjustLayout();
    window.addEventListener('resize', adjustLayout);

    // ============================================
    // Inline Terminal — click bug to transform
    // ============================================
    const bugTrigger       = document.getElementById('bug-trigger');
    const bugImage         = document.getElementById('bug-image');
    const inlineTerminal   = document.getElementById('inline-terminal');
    const terminalCloseBtn = document.getElementById('terminal-close');
    const terminalEl       = document.getElementById('terminal');
    const terminalContent  = document.getElementById('terminal-content');
    const commandInput     = document.getElementById('command-input');

    if (!bugTrigger || !inlineTerminal) return;

    let commandHistory = [];
    let historyIndex = -1;
    let terminalInitialized = false;

    // ---------- Commands ----------
    const commands = {
        help: {
            description: "Display this help message",
            execute: () => {
                let output = "Available commands:\n\n";
                Object.keys(commands).forEach(cmd => {
                    output += `<span class="help-command">${cmd}</span>\n`;
                    output += `<span class="help-description">${commands[cmd].description}</span>\n\n`;
                });
                return output;
            }
        },
        clear: {
            description: "Clear the terminal screen",
            execute: () => {
                terminalContent.querySelectorAll('.output').forEach(o => o.remove());
                return "";
            }
        },
        about: {
            description: "Display information about me",
            execute: () => (
                `Richard Ericsson - Data Analyst & Developer\n` +
                `Programmer with a background in Data Analysis and\n` +
                `Product Design. Python, SQL and Git are my main tools\n` +
                `but I can manage HTML and JavaScript.`
            )
        },
        date: {
            description: "Display current date and time",
            execute: () => new Date().toString()
        },
        echo: {
            description: "Echo back the input",
            execute: (args) => args.join(' ')
        },
        projects: {
            description: "Check out my projects",
            execute: () =>
                `Just go into my GitHub:\n` +
                `  • <a href="https://github.com/richie-le-bug" target="_blank" rel="noopener noreferrer" style="color:#0ff;text-decoration:underline;">https://github.com/richie-le-bug</a>\n`
        },
        social: {
            description: "Show social media information",
            execute: () =>
                `I'm currently only here:\n` +
                `  • <a href="https://www.are.na/richard-ericsson/all" target="_blank" rel="noopener noreferrer" style="color:#0ff;text-decoration:underline;">https://www.are.na/richard-ericsson/all</a>\n`
        },
        contact: {
            description: "Show contact information",
            execute: () =>
                `Contact me:\n` +
                `  • Email: richie_lebug@proton.me — type 'email' to contact me directly\n`
        },
        email: {
            description: "Send me an email",
            execute: () => {
                window.location.href = "mailto:richie_lebug@proton.me?subject=Hello%20from%20your%20website";
                return `Opening email client...\n`;
            }
        }
    };

    // ---------- Open / Close (in-place swap) ----------
    function openTerminal() {
        bugImage.hidden = true;
        inlineTerminal.hidden = false;
        bugTrigger.classList.add('terminal-active');
        bugTrigger.removeAttribute('title');
        setTimeout(() => commandInput.focus(), 30);

        if (!terminalInitialized) {
            terminalInitialized = true;
            setTimeout(() => executeCommand('help'), 120);
        }
    }

    function closeTerminal() {
        inlineTerminal.hidden = true;
        bugImage.hidden = false;
        bugTrigger.classList.remove('terminal-active');
        bugTrigger.setAttribute('title', 'Click me!');
    }

    // Click the banner to open the terminal
    bugTrigger.addEventListener('click', function (e) {
        // Don't re-open if user clicks inside terminal (input, links, close btn)
        if (inlineTerminal.contains(e.target) && !e.target.closest('#command-input')) return;
        if (!inlineTerminal.hidden) return; // already open
        openTerminal();
    });

    // Close button
    terminalCloseBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        closeTerminal();
    });

    // Escape closes it
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !inlineTerminal.hidden) {
            closeTerminal();
        }
    });

    // Keep focus inside input when clicking the terminal (but not on links)
    terminalEl.addEventListener('click', function (e) {
        if (e.target.tagName !== 'A' && !e.target.closest('.terminal-close')) {
            commandInput.focus();
        }
    });

    // ---------- Input handling ----------
    commandInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            const text = commandInput.value.trim();
            if (text) {
                commandHistory.push(text);
                historyIndex = commandHistory.length;
                executeCommand(text);
                commandInput.value = '';
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (commandHistory.length > 0) {
                historyIndex = Math.max(historyIndex - 1, 0);
                commandInput.value = commandHistory[historyIndex] || '';
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (commandHistory.length > 0) {
                historyIndex = Math.min(historyIndex + 1, commandHistory.length);
                commandInput.value = historyIndex === commandHistory.length
                    ? ''
                    : commandHistory[historyIndex] || '';
            }
        }
    });

    // ---------- Execute command ----------
    function executeCommand(input) {
        const args = input.split(' ');
        const cmd = args[0].toLowerCase();

        const outputDiv = document.createElement('div');
        outputDiv.className = 'output';

        const commandSpan = document.createElement('span');
        commandSpan.className = 'command';
        commandSpan.innerHTML = `<span class="prompt"><span class="user">visitor@web</span>:<span class="path">~/terminal</span>$</span> ${input}`;
        outputDiv.appendChild(commandSpan);
        outputDiv.appendChild(document.createElement('br'));

        if (commands[cmd]) {
            outputDiv.innerHTML += commands[cmd].execute(args.slice(1));
        } else if (cmd) {
            outputDiv.innerHTML += `Command not found: ${cmd}\nType 'help' for available commands`;
        }

        const commandLine = terminalContent.querySelector('.command-line');
        terminalContent.insertBefore(outputDiv, commandLine);

        setTimeout(() => {
            terminalEl.scrollTop = terminalEl.scrollHeight;
        }, 10);
    }

    // Blinking cursor
    setInterval(() => {
        const cursor = document.querySelector('.inline-terminal .cursor');
        if (cursor) cursor.classList.toggle('blink');
    }, 500);
});
