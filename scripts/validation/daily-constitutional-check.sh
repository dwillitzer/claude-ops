#!/bin/bash
# Daily Constitutional Compliance Check
# Run: ./scripts/validation/daily-constitutional-check.sh

set -e

echo "═══════════════════════════════════════════════════════"
echo "📋 Daily Constitutional Compliance Check"
echo "═══════════════════════════════════════════════════════"
echo ""

CLAUDE_DIR="${CLAUDE_DIR:-.}"
SCORE=0
MAX_SCORE=0

# Check 1: Progress log entries exist for today
echo "1️⃣ Checking progress log entries..."
TODAY=$(date +%Y-%m-%d)
PROGRESS_COUNT=$(find "$CLAUDE_DIR/memory-bank/progress_log" -name "$TODAY*.md" 2>/dev/null | wc -l)
MAX_SCORE=$((MAX_SCORE + 10))
if [ "$PROGRESS_COUNT" -gt 0 ]; then
    echo "   ✅ Found $PROGRESS_COUNT progress entries for today"
    SCORE=$((SCORE + 10))
else
    echo "   ⚠️  No progress entries for today"
fi

# Check 2: Feature lists updated recently
echo "2️⃣ Checking feature list freshness..."
MAX_SCORE=$((MAX_SCORE + 10))
STALE_FEATURES=0
for f in "$CLAUDE_DIR/memory-bank/feature_lists"/*.json; do
    if [ -f "$f" ] && [ "$(basename "$f")" != "TEMPLATE.json" ]; then
        # Check if file modified in last 24 hours
        if [ $(find "$f" -mtime -1 2>/dev/null | wc -l) -eq 0 ]; then
            STALE_FEATURES=$((STALE_FEATURES + 1))
        fi
    fi
done
if [ "$STALE_FEATURES" -eq 0 ]; then
    echo "   ✅ All feature lists current"
    SCORE=$((SCORE + 10))
else
    echo "   ⚠️  $STALE_FEATURES stale feature lists"
fi

# Check 3: activeContext.md updated
echo "3️⃣ Checking activeContext.md freshness..."
MAX_SCORE=$((MAX_SCORE + 10))
CONTEXT_FILE="$CLAUDE_DIR/memory-bank/active/activeContext.md"
if [ -f "$CONTEXT_FILE" ]; then
    if [ $(find "$CONTEXT_FILE" -mtime -1 2>/dev/null | wc -l) -gt 0 ]; then
        echo "   ✅ activeContext.md is current"
        SCORE=$((SCORE + 10))
    else
        echo "   ⚠️  activeContext.md is stale"
    fi
else
    echo "   ❌ activeContext.md missing!"
fi

# Check 4: No pending handoffs older than 24h
echo "4️⃣ Checking handoff freshness..."
MAX_SCORE=$((MAX_SCORE + 10))
STALE_HANDOFFS=0
for f in "$CLAUDE_DIR/memory-bank/decision_log"/*.md; do
    if [ -f "$f" ] && [ "$(basename "$f")" != "TEMPLATE.md" ]; then
        if grep -q "Status: PENDING" "$f" 2>/dev/null; then
            if [ $(find "$f" -mtime +1 2>/dev/null | wc -l) -gt 0 ]; then
                STALE_HANDOFFS=$((STALE_HANDOFFS + 1))
            fi
        fi
    fi
done
if [ "$STALE_HANDOFFS" -eq 0 ]; then
    echo "   ✅ No stale handoffs"
    SCORE=$((SCORE + 10))
else
    echo "   ⚠️  $STALE_HANDOFFS stale handoffs found"
fi

# Check 5: hive-progress.json exists and is current
echo "5️⃣ Checking hive-progress.json..."
MAX_SCORE=$((MAX_SCORE + 10))
HIVE_FILE="$CLAUDE_DIR/memory-bank/active/hive-progress.json"
if [ -f "$HIVE_FILE" ]; then
    if [ $(find "$HIVE_FILE" -mtime -1 2>/dev/null | wc -l) -gt 0 ]; then
        echo "   ✅ hive-progress.json is current"
        SCORE=$((SCORE + 10))
    else
        echo "   ⚠️  hive-progress.json is stale"
        SCORE=$((SCORE + 5))
    fi
else
    echo "   ⚠️  hive-progress.json missing"
fi

# Calculate percentage
if [ "$MAX_SCORE" -gt 0 ]; then
    PERCENTAGE=$((SCORE * 100 / MAX_SCORE))
else
    PERCENTAGE=0
fi

echo ""
echo "═══════════════════════════════════════════════════════"
echo "📊 Constitutional Compliance Score: $SCORE/$MAX_SCORE ($PERCENTAGE%)"
echo "═══════════════════════════════════════════════════════"

if [ "$PERCENTAGE" -ge 90 ]; then
    echo "✅ COMPLIANT"
    exit 0
elif [ "$PERCENTAGE" -ge 70 ]; then
    echo "⚠️  CONDITIONAL - Needs improvement"
    exit 0
else
    echo "❌ NON-COMPLIANT - Action required"
    exit 1
fi
