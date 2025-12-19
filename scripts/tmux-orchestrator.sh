#!/bin/bash
#
# Claude-Ops Tmux Orchestrator
# Spawns directors in tmux panes for parallel multi-agent execution
#
# Usage: ./tmux-orchestrator.sh [session-name] [directors...]
# Example: ./tmux-orchestrator.sh claude-ops engineering architecture research
#

set -e

SESSION_NAME="${1:-claude-ops}"
shift 2>/dev/null || true

# Default directors if none specified
DIRECTORS="${@:-engineering architecture research operations}"

# Colors for output
GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}╔════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║  Claude-Ops Tmux Orchestrator              ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════╝${NC}"
echo ""

# Check if session already exists
if tmux has-session -t "$SESSION_NAME" 2>/dev/null; then
    echo -e "${GREEN}Attaching to existing session: $SESSION_NAME${NC}"
    tmux attach -t "$SESSION_NAME"
    exit 0
fi

echo -e "Creating tmux session: ${GREEN}$SESSION_NAME${NC}"
echo -e "Directors: ${GREEN}$DIRECTORS${NC}"
echo ""

# Create new session with first director
FIRST_DIRECTOR=$(echo $DIRECTORS | awk '{print $1}')
REMAINING=$(echo $DIRECTORS | cut -d' ' -f2-)

tmux new-session -d -s "$SESSION_NAME" -n "hive"

# Create the hive coordinator pane (bottom)
tmux send-keys -t "$SESSION_NAME" "cd $(pwd) && echo '🐝 Hive Coordinator - Monitoring all directors'" Enter
tmux send-keys -t "$SESSION_NAME" "node bin/claude-ops.js hive status" Enter

# Split for directors
PANE_COUNT=0
for DIRECTOR in $DIRECTORS; do
    if [ $PANE_COUNT -eq 0 ]; then
        # First split - horizontal
        tmux split-window -h -t "$SESSION_NAME"
    elif [ $PANE_COUNT -eq 1 ]; then
        # Second split - go to pane 0 and split vertical
        tmux select-pane -t "$SESSION_NAME:0.0"
        tmux split-window -v -t "$SESSION_NAME"
    elif [ $PANE_COUNT -eq 2 ]; then
        # Third split - go to pane 1 and split vertical
        tmux select-pane -t "$SESSION_NAME:0.1"
        tmux split-window -v -t "$SESSION_NAME"
    fi

    # Send director startup command
    tmux send-keys -t "$SESSION_NAME" "cd $(pwd)" Enter
    tmux send-keys -t "$SESSION_NAME" "echo '🎯 $DIRECTOR Director'" Enter
    tmux send-keys -t "$SESSION_NAME" "node bin/claude-ops.js hive sync $DIRECTOR --status active --task 'Awaiting instructions'" Enter

    PANE_COUNT=$((PANE_COUNT + 1))

    # Limit to 4 director panes
    if [ $PANE_COUNT -ge 4 ]; then
        break
    fi
done

# Select the hive coordinator pane
tmux select-pane -t "$SESSION_NAME:0.0"

# Set pane titles (if terminal supports it)
tmux set-option -t "$SESSION_NAME" pane-border-status top
tmux set-option -t "$SESSION_NAME" pane-border-format " #{pane_index}: #{pane_title} "

echo -e "${GREEN}✓ Session created with $(echo $DIRECTORS | wc -w) directors${NC}"
echo ""
echo "Commands:"
echo "  tmux attach -t $SESSION_NAME    # Attach to session"
echo "  tmux kill-session -t $SESSION_NAME  # Kill session"
echo ""

# Attach to session
tmux attach -t "$SESSION_NAME"
