#!/bin/bash

# Pre-Deployment Security & Readiness Check
echo "🔍 MerakiNexus - Pre-Deployment Check"
echo "======================================"
echo ""

ERRORS=0
WARNINGS=0

# Check 1: .env not tracked by git
echo "1️⃣  Checking .env is not tracked by git..."
if git ls-files | grep -q "^\.env$"; then
    echo "   ❌ ERROR: .env is tracked by git!"
    echo "      Run: git rm --cached .env"
    ERRORS=$((ERRORS + 1))
else
    echo "   ✅ .env is not tracked (safe)"
fi

# Check 2: No hardcoded secrets
echo ""
echo "2️⃣  Checking for hardcoded secrets..."
SECRETS=$(grep -r "0x[a-fA-F0-9]\{64\}" --include="*.js" . 2>/dev/null | grep -v "node_modules" | grep -v "YOUR_" | grep -v "process.env" | grep -v ".git" || echo "")
if [ ! -z "$SECRETS" ]; then
    echo "   ⚠️  WARNING: Possible hardcoded private keys found:"
    echo "$SECRETS" | head -3
    WARNINGS=$((WARNINGS + 1))
else
    echo "   ✅ No hardcoded secrets found"
fi

# Check 3: .gitignore configured
echo ""
echo "3️⃣  Checking .gitignore..."
if [ -f .gitignore ] && grep -q ".env" .gitignore; then
    echo "   ✅ .gitignore includes .env"
else
    echo "   ❌ ERROR: .gitignore missing or doesn't include .env"
    ERRORS=$((ERRORS + 1))
fi

# Check 4: Git status
echo ""
echo "4️⃣  Checking git status..."
UNTRACKED=$(git status --short | grep "^??" | wc -l | tr -d ' ')
MODIFIED=$(git status --short | grep "^ M" | wc -l | tr -d ' ')
echo "   📊 Untracked files: $UNTRACKED"
echo "   📊 Modified files: $MODIFIED"

# Check 5: Package.json exists
echo ""
echo "5️⃣  Checking package.json..."
if [ -f package.json ]; then
    echo "   ✅ package.json exists"
else
    echo "   ❌ ERROR: package.json not found"
    ERRORS=$((ERRORS + 1))
fi

# Check 6: Vercel.json exists
echo ""
echo "6️⃣  Checking vercel.json..."
if [ -f vercel.json ]; then
    echo "   ✅ vercel.json exists"
    BUILD_FILE=$(grep "\"src\":" vercel.json | head -1 | cut -d'"' -f4)
    echo "   📄 Build file: $BUILD_FILE"
    if [ -f "$BUILD_FILE" ]; then
        echo "   ✅ Build file exists"
    else
        echo "   ❌ ERROR: Build file not found: $BUILD_FILE"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo "   ⚠️  WARNING: vercel.json not found"
    WARNINGS=$((WARNINGS + 1))
fi

# Check 7: Documentation
echo ""
echo "7️⃣  Checking documentation..."
DOCS=("README.md" "QUICK_START.md" "DEPLOYMENT_GUIDE.md")
for doc in "${DOCS[@]}"; do
    if [ -f "$doc" ]; then
        echo "   ✅ $doc exists"
    else
        echo "   ⚠️  $doc missing"
        WARNINGS=$((WARNINGS + 1))
    fi
done

# Summary
echo ""
echo "========================================"
echo "📊 SUMMARY"
echo "========================================"
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo "🎉 All checks passed!"
    echo ""
    echo "✅ READY FOR GITHUB: YES"
    echo "✅ READY FOR VERCEL: YES (after env vars)"
    echo ""
    echo "📋 Next steps:"
    echo "   1. Review changes: git status"
    echo "   2. Commit: git add . && git commit -m 'Fix: Gas estimation error'"
    echo "   3. Push: git push origin main"
    echo "   4. Deploy to Vercel (see DEPLOYMENT_GUIDE.md)"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo "⚠️  $WARNINGS warning(s) found"
    echo ""
    echo "✅ READY FOR GITHUB: YES"
    echo "⚠️  READY FOR VERCEL: YES (with warnings)"
    echo ""
    echo "Review warnings above before deploying."
    exit 0
else
    echo "❌ $ERRORS error(s) found"
    echo "⚠️  $WARNINGS warning(s) found"
    echo ""
    echo "❌ NOT READY FOR DEPLOYMENT"
    echo ""
    echo "Fix errors above before deploying."
    exit 1
fi
