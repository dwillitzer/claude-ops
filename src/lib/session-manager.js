/**
 * Session Manager
 * Handles session persistence, checkpoints, and resume functionality
 * for long-running Claude Code agents
 */

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Default session directory
const DEFAULT_SESSION_DIR = '.claude-ops/sessions';

class SessionManager {
    constructor(baseDir = process.cwd()) {
        this.baseDir = baseDir;
        this.sessionDir = path.join(baseDir, DEFAULT_SESSION_DIR);
        this.currentSession = null;
        this.ensureSessionDir();
    }

    ensureSessionDir() {
        if (!fs.existsSync(this.sessionDir)) {
            fs.mkdirSync(this.sessionDir, { recursive: true });
        }
    }

    /**
     * Create a new session
     * @param {Object} options - Session options
     * @returns {Object} - Session object
     */
    createSession(options = {}) {
        const sessionId = uuidv4();
        const session = {
            id: sessionId,
            type: options.type || 'general',
            director: options.director || null,
            feature: options.feature || null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: 'active',
            checkpoints: [],
            context: options.context || {},
            progress: [],
            metadata: {
                cwd: process.cwd(),
                node_version: process.version,
                platform: process.platform
            }
        };

        this.saveSession(session);
        this.currentSession = session;
        return session;
    }

    /**
     * Save session to disk
     * @param {Object} session - Session object
     */
    saveSession(session) {
        const sessionPath = path.join(this.sessionDir, `${session.id}.json`);
        fs.writeFileSync(sessionPath, JSON.stringify(session, null, 2));
    }

    /**
     * Load a session by ID
     * @param {string} sessionId - Session ID
     * @returns {Object|null} - Session object or null
     */
    loadSession(sessionId) {
        const sessionPath = path.join(this.sessionDir, `${sessionId}.json`);
        if (fs.existsSync(sessionPath)) {
            const data = fs.readFileSync(sessionPath, 'utf8');
            return JSON.parse(data);
        }
        return null;
    }

    /**
     * Resume a session
     * @param {string} sessionId - Session ID to resume
     * @returns {Object|null} - Session object or null
     */
    resumeSession(sessionId) {
        const session = this.loadSession(sessionId);
        if (session) {
            session.status = 'active';
            session.updatedAt = new Date().toISOString();
            session.progress.push({
                timestamp: new Date().toISOString(),
                action: 'resumed',
                details: 'Session resumed'
            });
            this.saveSession(session);
            this.currentSession = session;
        }
        return session;
    }

    /**
     * Create a checkpoint in the current session
     * @param {Object} options - Checkpoint options
     * @returns {Object} - Checkpoint object
     */
    createCheckpoint(options = {}) {
        if (!this.currentSession) {
            throw new Error('No active session');
        }

        const checkpoint = {
            id: uuidv4(),
            timestamp: new Date().toISOString(),
            name: options.name || `checkpoint-${this.currentSession.checkpoints.length + 1}`,
            state: options.state || {},
            notes: options.notes || '',
            files: options.files || [],
            recoverable: true
        };

        this.currentSession.checkpoints.push(checkpoint);
        this.currentSession.updatedAt = new Date().toISOString();
        this.saveSession(this.currentSession);
        return checkpoint;
    }

    /**
     * Restore from a checkpoint
     * @param {string} checkpointId - Checkpoint ID
     * @returns {Object|null} - Checkpoint object or null
     */
    restoreCheckpoint(checkpointId) {
        if (!this.currentSession) {
            throw new Error('No active session');
        }

        const checkpoint = this.currentSession.checkpoints.find(c => c.id === checkpointId);
        if (checkpoint) {
            this.currentSession.progress.push({
                timestamp: new Date().toISOString(),
                action: 'restored',
                details: `Restored from checkpoint: ${checkpoint.name}`
            });
            this.currentSession.updatedAt = new Date().toISOString();
            this.saveSession(this.currentSession);
        }
        return checkpoint;
    }

    /**
     * List all sessions
     * @param {Object} filter - Filter options
     * @returns {Array} - List of sessions
     */
    listSessions(filter = {}) {
        const sessions = [];

        if (!fs.existsSync(this.sessionDir)) {
            return sessions;
        }

        const files = fs.readdirSync(this.sessionDir);
        for (const file of files) {
            if (file.endsWith('.json')) {
                const sessionPath = path.join(this.sessionDir, file);
                const data = fs.readFileSync(sessionPath, 'utf8');
                const session = JSON.parse(data);

                // Apply filters
                if (filter.status && session.status !== filter.status) continue;
                if (filter.director && session.director !== filter.director) continue;
                if (filter.type && session.type !== filter.type) continue;

                sessions.push(session);
            }
        }

        // Sort by updatedAt descending
        return sessions.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    }

    /**
     * Log progress in current session
     * @param {string} action - Action description
     * @param {Object} details - Additional details
     */
    logProgress(action, details = {}) {
        if (!this.currentSession) {
            return;
        }

        this.currentSession.progress.push({
            timestamp: new Date().toISOString(),
            action,
            details
        });
        this.currentSession.updatedAt = new Date().toISOString();
        this.saveSession(this.currentSession);
    }

    /**
     * Complete the current session
     * @param {Object} summary - Session summary
     */
    completeSession(summary = {}) {
        if (!this.currentSession) {
            throw new Error('No active session');
        }

        this.currentSession.status = 'completed';
        this.currentSession.completedAt = new Date().toISOString();
        this.currentSession.updatedAt = new Date().toISOString();
        this.currentSession.summary = summary;
        this.saveSession(this.currentSession);

        const completed = this.currentSession;
        this.currentSession = null;
        return completed;
    }

    /**
     * Archive old sessions
     * @param {number} daysOld - Archive sessions older than this many days
     */
    archiveSessions(daysOld = 30) {
        const archiveDir = path.join(this.sessionDir, 'archive');
        if (!fs.existsSync(archiveDir)) {
            fs.mkdirSync(archiveDir, { recursive: true });
        }

        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - daysOld);

        const sessions = this.listSessions({ status: 'completed' });
        let archived = 0;

        for (const session of sessions) {
            if (new Date(session.completedAt) < cutoff) {
                const srcPath = path.join(this.sessionDir, `${session.id}.json`);
                const dstPath = path.join(archiveDir, `${session.id}.json`);
                fs.renameSync(srcPath, dstPath);
                archived++;
            }
        }

        return archived;
    }

    /**
     * Get session statistics
     * @returns {Object} - Session statistics
     */
    getStats() {
        const sessions = this.listSessions();
        const active = sessions.filter(s => s.status === 'active').length;
        const completed = sessions.filter(s => s.status === 'completed').length;
        const paused = sessions.filter(s => s.status === 'paused').length;

        return {
            total: sessions.length,
            active,
            completed,
            paused,
            checkpoints: sessions.reduce((sum, s) => sum + (s.checkpoints?.length || 0), 0)
        };
    }

    /**
     * Get current session
     * @returns {Object|null} - Current session or null
     */
    getCurrentSession() {
        return this.currentSession;
    }

    /**
     * Pause the current session
     */
    pauseSession() {
        if (!this.currentSession) {
            throw new Error('No active session');
        }

        this.currentSession.status = 'paused';
        this.currentSession.updatedAt = new Date().toISOString();
        this.currentSession.progress.push({
            timestamp: new Date().toISOString(),
            action: 'paused',
            details: 'Session paused'
        });
        this.saveSession(this.currentSession);

        const paused = this.currentSession;
        this.currentSession = null;
        return paused;
    }
}

// Singleton instance
let instance = null;

function getSessionManager(baseDir) {
    if (!instance || (baseDir && instance.baseDir !== baseDir)) {
        instance = new SessionManager(baseDir);
    }
    return instance;
}

module.exports = {
    SessionManager,
    getSessionManager
};
