document.addEventListener('DOMContentLoaded', function() {
            const terminalContent = document.getElementById('terminal-content');
            const commandInput = document.getElementById('command-input');
            const terminal = document.getElementById('terminal');
            
            let commandHistory = [];
            let historyIndex = -1;
            
            // ASCII Art variations (you can add more)
            const banners = [
                `
            /(   )\
            \(   )/
       ..    \\_//    ..
       //   _0.-.0_   \\
       \'._/       \_.'/
        '-.\.--.--./.-'
        __/ : :Y: : \__
';,  .-(_| : : | : : |_)-.  ,:'
  \\/.'  |: : :|: : :|  '.\//
   (/    |: : :|: : :|    \)
         |: : :|: : :;
        /\ : : | : : /\
       (_/'.: :.: :.'\_)
        \\  '"'""'   //
         \\         //
          ':.     .:'
`
            ];

            // Commands available
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
                        const outputs = terminalContent.querySelectorAll('.output');
                        outputs.forEach(output => output.remove());
                        return "";
                    }
                },
                about: {
                    description: "Display information about me",
                    execute: () => {
                        return `Richard Ericsson - Data Analyst & Developer\n` +
                               `"I'm a Programmer with background in Data analysis and Product Design <br>skilled in coding and command-line tools. I combine design thinking with technical analysis<br>to explore web qualities and build efficient data collection systems that gather different<br>sources of data to one place for clearer analysis. Python, SQL and Git are my main tools <br>but I can manage HTML and JavaScript".`;
                    }
                },
                date: {
                    description: "Display current date and time",
                    execute: () => {
                        const now = new Date();
                        return now.toString();
                    }
                },
                echo: {
                    description: "Echo back the input",
                    execute: (args) => {
                        return args.join(' ');
                    }
                },
                projects: {
                    description: "Check out my projects",
                    execute: () => {
                        return `Just go into my GitHub:\n` +
                            `  • GitHub: <a href="https://github.com/richie-le-bug" target="_blank" rel="noopener noreferrer" style="color: #0ff; text-decoration: underline;">https://github.com/richie-le-bug</a>\n`;
                    }
                },
                social: {
                    description: "Show social media information",
                    execute: () => {
                        return `I'm currently only here:\n` +
                                `  • Arena: <a href="https://www.are.na/richard-ericsson/all" target="_blank" rel="noopener noreferrer" style="color: #0ff; text-decoration: underline;">https://www.are.na/richard-ericsson/all</a>\n`;
                    }
                },
                contact: {
                    description: "Show contact information",
                    execute: () => {
                        return `Contact me:\n` +
                               `  • Email: richie_lebug@proton.me` + ` type 'email' to contact me directly\n`;
                    }
                },
                email: {
                    description: "Send me an email",
                    execute: () => {
                        // This will open the default email client with your email address
                        window.location.href = "mailto: richie_lebug@proton.me?subject=Hello%20from%20your%20website";
        
                        // Optional: You can still return a message for the terminal
                        return `Opening email client...\n`;
                        }
                    },

            };

            // Focus input on load
            commandInput.focus();

            // Handle command input
            commandInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    const commandText = commandInput.value.trim();
                    if (commandText) {
                        // Add to history
                        commandHistory.push(commandText);
                        historyIndex = commandHistory.length;
                        
                        // Execute command
                        executeCommand(commandText);
                        
                        // Clear input
                        commandInput.value = '';
                    }
                } else if (e.key === 'ArrowUp') {
                    // Navigate command history up
                    e.preventDefault();
                    if (commandHistory.length > 0) {
                        historyIndex = Math.max(historyIndex - 1, 0);
                        commandInput.value = commandHistory[historyIndex] || '';
                    }
                } else if (e.key === 'ArrowDown') {
                    // Navigate command history down
                    e.preventDefault();
                    if (commandHistory.length > 0) {
                        historyIndex = Math.min(historyIndex + 1, commandHistory.length);
                        commandInput.value = historyIndex === commandHistory.length ? '' : commandHistory[historyIndex] || '';
                    }
                }
            });

            // Execute a command
            function executeCommand(input) {
                const args = input.split(' ');
                const cmd = args[0].toLowerCase();
                
                // Create command output element
                const outputDiv = document.createElement('div');
                outputDiv.className = 'output';
                
                // Show the command that was typed
                const commandSpan = document.createElement('span');
                commandSpan.className = 'command';
                commandSpan.innerHTML = `<span class="prompt"><span class="user">visitor@web</span>:<span class="path">~/terminal</span>$</span> ${input}`;
                outputDiv.appendChild(commandSpan);
                
                // Add a line break
                outputDiv.appendChild(document.createElement('br'));
                
                // Execute command or show error
                if (commands[cmd]) {
                    const result = commands[cmd].execute(args.slice(1));
                    outputDiv.innerHTML += result;
                } else if (cmd) {
                    outputDiv.innerHTML += `Command not found: ${cmd}\nType 'help' for available commands`;
                }
                
                // Insert before the command line
                const commandLine = terminalContent.querySelector('.command-line');
                terminalContent.insertBefore(outputDiv, commandLine);
                
                // Scroll to bottom
                setTimeout(() => {
                    terminal.scrollTop = terminal.scrollHeight;
                }, 10);
            }

            // Click anywhere to focus input
            terminal.addEventListener('click', () => {
                commandInput.focus();
            });

            // Add blinking cursor effect
            setInterval(() => {
                const cursor = document.querySelector('.cursor');
                cursor.classList.toggle('blink');
            }, 500);
        });