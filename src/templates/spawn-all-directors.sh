#!/bin/bash
# spawn-all-directors.sh
# Spawn all 8 claude-ops directors as queenbees
# Run this from project root or ~/.claude directory

set -e  # Exit on error

# Detect .claude directory location
if [ -d ".claude/agents" ]; then
    AGENT_DIR=".claude/agents"
elif [ -d "agents" ]; then
    AGENT_DIR="agents"
else
    echo "❌ Error: Cannot find agents directory"
    echo "   Run this from project root (where .claude exists) or from .claude directory"
    exit 1
fi

echo "🐝 Spawning all 8 directors as queenbees..."
echo "📁 Using agents from: $AGENT_DIR"
echo ""

# Strategic Directors (High-level decision making)
echo "🎯 Strategic Directors:"
npx claude-flow@alpha hive-mind spawn "Architecture leadership" \
  --queen-type strategic \
  --max-workers 8 \
  --consensus majority \
  --config $AGENT_DIR/architecture-director.md &

npx claude-flow@alpha hive-mind spawn "Business strategy" \
  --queen-type strategic \
  --max-workers 8 \
  --consensus weighted \
  --config $AGENT_DIR/business-director.md &

npx claude-flow@alpha hive-mind spawn "Operations leadership" \
  --queen-type strategic \
  --max-workers 8 \
  --consensus byzantine \
  --encryption \
  --config $AGENT_DIR/operations-director.md &

npx claude-flow@alpha hive-mind spawn "Security oversight" \
  --queen-type strategic \
  --max-workers 6 \
  --consensus byzantine \
  --encryption \
  --config $AGENT_DIR/security-director.md &

echo "   ✓ Architecture, Business, Operations, Security"

# Tactical Directors (Execution-focused)
echo "⚡ Tactical Directors:"
npx claude-flow@alpha hive-mind spawn "Design execution" \
  --queen-type tactical \
  --max-workers 6 \
  --config $AGENT_DIR/design-director.md &

npx claude-flow@alpha hive-mind spawn "Engineering implementation" \
  --queen-type tactical \
  --max-workers 10 \
  --auto-scale \
  --config $AGENT_DIR/engineering-director.md &

npx claude-flow@alpha hive-mind spawn "Documentation creation" \
  --queen-type tactical \
  --max-workers 4 \
  --config $AGENT_DIR/documentation-director.md &

echo "   ✓ Design, Engineering, Documentation"

# Adaptive Director (Exploratory)
echo "🔬 Adaptive Director:"
npx claude-flow@alpha hive-mind spawn "Research exploration" \
  --queen-type adaptive \
  --max-workers 6 \
  --config $AGENT_DIR/research-director.md &

echo "   ✓ Research"

echo ""
echo "⏳ Waiting for all spawns to complete..."
wait

echo ""
echo "✅ All 8 directors spawned successfully!"
echo ""
echo "📊 Next steps:"
echo "   • Check status: npx claude-flow@alpha hive-mind status"
echo "   • View sessions: npx claude-flow@alpha hive-mind sessions"
echo "   • View metrics: npx claude-flow@alpha hive-mind metrics"
