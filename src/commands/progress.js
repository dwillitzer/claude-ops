/**
 * Progress Logging Commands
 * Manages progress logs for sessions and features
 */

const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Progress log directory
const PROGRESS_DIR = 'memory-bank/progress_log';

/**
 * Ensure progress directory exists
 */
function ensureProgressDir() {
    const dir = path.join(process.cwd(), PROGRESS_DIR);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

/**
 * Get today's log path
 */
function getTodayLogPath() {
    const today = new Date().toISOString().split('T')[0];
    return path.join(process.cwd(), PROGRESS_DIR, `${today}.md`);
}

/**
 * Load or create today's log
 */
function loadTodayLog() {
    ensureProgressDir();
    const logPath = getTodayLogPath();

    if (fs.existsSync(logPath)) {
        return fs.readFileSync(logPath, 'utf8');
    }

    const today = new Date().toISOString().split('T')[0];
    const template = `# Progress Log: ${today}

## Session Overview
- **Date**: ${today}
- **Status**: In Progress

---

## Progress Entries

`;
    return template;
}

/**
 * Save today's log
 */
function saveTodayLog(content) {
    ensureProgressDir();
    const logPath = getTodayLogPath();
    fs.writeFileSync(logPath, content);
}

/**
 * Log progress entry
 */
async function log(message, options) {
    const timestamp = new Date().toISOString();
    const timeStr = new Date().toLocaleTimeString();

    let content = loadTodayLog();

    // Determine entry type
    const type = options.type || 'progress';
    const typeEmoji = {
        progress: '📝',
        milestone: '🎯',
        decision: '⚖️',
        blocker: '🚧',
        resolved: '✅',
        learning: '💡',
        handoff: '🤝'
    }[type] || '📝';

    // Build entry
    let entry = `### ${timeStr} - ${typeEmoji} ${type.charAt(0).toUpperCase() + type.slice(1)}\n`;
    entry += `${message}\n`;

    if (options.feature) {
        entry += `- **Feature**: ${options.feature}\n`;
    }
    if (options.director) {
        entry += `- **Director**: ${options.director}\n`;
    }
    if (options.session) {
        entry += `- **Session**: ${options.session}\n`;
    }
    if (options.tags) {
        entry += `- **Tags**: ${options.tags}\n`;
    }

    entry += '\n---\n\n';

    // Append to log
    content += entry;
    saveTodayLog(content);

    console.log(chalk.green('Progress logged'));
    console.log(chalk.gray(`[${timeStr}]`), chalk.cyan(type), message);

    return { timestamp, type, message };
}

/**
 * View progress logs
 */
async function view(options) {
    ensureProgressDir();
    const progressDir = path.join(process.cwd(), PROGRESS_DIR);

    // Get date to view
    let targetDate = options.date || new Date().toISOString().split('T')[0];
    const logPath = path.join(progressDir, `${targetDate}.md`);

    if (!fs.existsSync(logPath)) {
        console.log(chalk.yellow(`No progress log for ${targetDate}`));

        // List available logs
        const files = fs.readdirSync(progressDir)
            .filter(f => f.endsWith('.md') && f !== 'TEMPLATE.md')
            .sort()
            .reverse()
            .slice(0, 5);

        if (files.length > 0) {
            console.log(chalk.gray('Recent logs:'));
            for (const f of files) {
                console.log(chalk.gray(`  - ${f.replace('.md', '')}`));
            }
        }
        return;
    }

    const content = fs.readFileSync(logPath, 'utf8');

    if (options.raw) {
        console.log(content);
    } else {
        // Pretty print
        console.log(chalk.cyan.bold(`Progress Log: ${targetDate}`));
        console.log(chalk.gray('═'.repeat(60)));
        console.log('');

        // Parse and display entries
        const lines = content.split('\n');
        for (const line of lines) {
            if (line.startsWith('### ')) {
                console.log(chalk.yellow(line.substring(4)));
            } else if (line.startsWith('- **')) {
                console.log(chalk.gray(line));
            } else if (line.startsWith('# ')) {
                // Skip title
            } else if (line.startsWith('## ')) {
                console.log(chalk.cyan.bold(line.substring(3)));
            } else if (line === '---') {
                console.log(chalk.gray('─'.repeat(40)));
            } else if (line.trim()) {
                console.log(line);
            }
        }
    }
}

/**
 * Search progress logs
 */
async function search(query, options) {
    ensureProgressDir();
    const progressDir = path.join(process.cwd(), PROGRESS_DIR);

    const files = fs.readdirSync(progressDir)
        .filter(f => f.endsWith('.md') && f !== 'TEMPLATE.md')
        .sort()
        .reverse();

    if (files.length === 0) {
        console.log(chalk.yellow('No progress logs found'));
        return;
    }

    console.log(chalk.cyan(`Searching for: "${query}"`));
    console.log(chalk.gray('─'.repeat(50)));
    console.log('');

    let totalMatches = 0;
    const limit = options.limit ? parseInt(options.limit) : 20;

    for (const file of files) {
        if (totalMatches >= limit) break;

        const filePath = path.join(progressDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n');

        let fileHasMatch = false;
        let currentEntry = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            if (line.startsWith('### ')) {
                // New entry - check if previous had matches
                if (currentEntry.length > 0 && currentEntry.some(l => l.toLowerCase().includes(query.toLowerCase()))) {
                    if (!fileHasMatch) {
                        console.log(chalk.white.bold(file.replace('.md', '')));
                        fileHasMatch = true;
                    }
                    for (const entryLine of currentEntry) {
                        if (entryLine.toLowerCase().includes(query.toLowerCase())) {
                            const highlighted = entryLine.replace(
                                new RegExp(query, 'gi'),
                                match => chalk.yellow.bold(match)
                            );
                            console.log(chalk.gray('  '), highlighted);
                            totalMatches++;
                        }
                    }
                    console.log('');
                }
                currentEntry = [line];
            } else if (line.trim() && !line.startsWith('---')) {
                currentEntry.push(line);
            }
        }

        // Check last entry
        if (currentEntry.some(l => l.toLowerCase().includes(query.toLowerCase()))) {
            if (!fileHasMatch) {
                console.log(chalk.white.bold(file.replace('.md', '')));
            }
            for (const entryLine of currentEntry) {
                if (entryLine.toLowerCase().includes(query.toLowerCase())) {
                    const highlighted = entryLine.replace(
                        new RegExp(query, 'gi'),
                        match => chalk.yellow.bold(match)
                    );
                    console.log(chalk.gray('  '), highlighted);
                    totalMatches++;
                }
            }
        }
    }

    console.log(chalk.gray('─'.repeat(50)));
    console.log(chalk.gray(`Found ${totalMatches} matches`));
}

/**
 * Show progress summary
 */
async function summary(options) {
    ensureProgressDir();
    const progressDir = path.join(process.cwd(), PROGRESS_DIR);

    const files = fs.readdirSync(progressDir)
        .filter(f => f.endsWith('.md') && f !== 'TEMPLATE.md')
        .sort()
        .reverse();

    // Determine date range
    const days = options.days ? parseInt(options.days) : 7;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const recentFiles = files.filter(f => {
        const fileDate = new Date(f.replace('.md', ''));
        return fileDate >= cutoffDate;
    });

    console.log(chalk.cyan.bold(`Progress Summary (Last ${days} days)`));
    console.log(chalk.gray('═'.repeat(60)));
    console.log('');

    // Count entry types
    const typeCounts = {};
    const directorActivity = {};
    const featureActivity = {};
    let totalEntries = 0;

    for (const file of recentFiles) {
        const filePath = path.join(progressDir, file);
        const content = fs.readFileSync(filePath, 'utf8');

        // Count types (look for emoji patterns)
        const typePatterns = {
            progress: /📝/g,
            milestone: /🎯/g,
            decision: /⚖️/g,
            blocker: /🚧/g,
            resolved: /✅/g,
            learning: /💡/g,
            handoff: /🤝/g
        };

        for (const [type, pattern] of Object.entries(typePatterns)) {
            const matches = content.match(pattern);
            if (matches) {
                typeCounts[type] = (typeCounts[type] || 0) + matches.length;
                totalEntries += matches.length;
            }
        }

        // Count director references
        const directorMatch = content.match(/\*\*Director\*\*: (\w+)/g);
        if (directorMatch) {
            for (const match of directorMatch) {
                const director = match.replace('**Director**: ', '');
                directorActivity[director] = (directorActivity[director] || 0) + 1;
            }
        }

        // Count feature references
        const featureMatch = content.match(/\*\*Feature\*\*: (.+)/g);
        if (featureMatch) {
            for (const match of featureMatch) {
                const feature = match.replace('**Feature**: ', '');
                featureActivity[feature] = (featureActivity[feature] || 0) + 1;
            }
        }
    }

    // Display summary
    console.log(chalk.white('Entry Types:'));
    for (const [type, count] of Object.entries(typeCounts).sort((a, b) => b[1] - a[1])) {
        const bar = '█'.repeat(Math.min(count, 20));
        console.log(chalk.gray(`  ${type.padEnd(12)}`), chalk.cyan(bar), count);
    }
    console.log('');

    if (Object.keys(directorActivity).length > 0) {
        console.log(chalk.white('Director Activity:'));
        for (const [director, count] of Object.entries(directorActivity).sort((a, b) => b[1] - a[1])) {
            console.log(chalk.gray(`  ${director.padEnd(15)}`), chalk.cyan(count), 'entries');
        }
        console.log('');
    }

    if (Object.keys(featureActivity).length > 0) {
        console.log(chalk.white('Feature Activity:'));
        for (const [feature, count] of Object.entries(featureActivity).sort((a, b) => b[1] - a[1]).slice(0, 5)) {
            console.log(chalk.gray(`  ${feature.substring(0, 30).padEnd(32)}`), chalk.cyan(count));
        }
        console.log('');
    }

    console.log(chalk.gray('─'.repeat(60)));
    console.log(chalk.white('Total:'), totalEntries, 'entries across', recentFiles.length, 'days');
}

/**
 * Export progress logs
 */
async function exportLogs(options) {
    ensureProgressDir();
    const progressDir = path.join(process.cwd(), PROGRESS_DIR);

    const files = fs.readdirSync(progressDir)
        .filter(f => f.endsWith('.md') && f !== 'TEMPLATE.md')
        .sort();

    // Filter by date range
    let filteredFiles = files;
    if (options.from) {
        filteredFiles = filteredFiles.filter(f => f.replace('.md', '') >= options.from);
    }
    if (options.to) {
        filteredFiles = filteredFiles.filter(f => f.replace('.md', '') <= options.to);
    }

    const format = options.format || 'md';
    const outputPath = options.output || `progress-export.${format}`;

    let content = '';

    if (format === 'json') {
        const entries = [];
        for (const file of filteredFiles) {
            const filePath = path.join(progressDir, file);
            const fileContent = fs.readFileSync(filePath, 'utf8');
            entries.push({
                date: file.replace('.md', ''),
                content: fileContent
            });
        }
        content = JSON.stringify(entries, null, 2);
    } else {
        // Markdown concatenation
        content = `# Progress Log Export\n\nExported: ${new Date().toISOString()}\n\n---\n\n`;
        for (const file of filteredFiles) {
            const filePath = path.join(progressDir, file);
            const fileContent = fs.readFileSync(filePath, 'utf8');
            content += fileContent + '\n\n---\n\n';
        }
    }

    fs.writeFileSync(outputPath, content);
    console.log(chalk.green(`Exported ${filteredFiles.length} logs to ${outputPath}`));
}

module.exports = {
    log,
    view,
    search,
    summary,
    export: exportLogs
};
