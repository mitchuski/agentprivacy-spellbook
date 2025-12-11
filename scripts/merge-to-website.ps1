# Merge Script: agentprivacy-zypher → agentprivacy Website
# This script helps automate the merge process

param(
    [string]$WebsiteRepoPath = "",
    [switch]$DryRun = $false,
    [switch]$KeepBackend = $true
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 Merge Script: agentprivacy-zypher → agentprivacy Website" -ForegroundColor Cyan
Write-Host ""

# Get current directory (should be agentprivacy-zypher root)
$SourceRepoPath = $PSScriptRoot + "\.."
$SourceRepoPath = Resolve-Path $SourceRepoPath

Write-Host "Source Repo (zypher): $SourceRepoPath" -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "$SourceRepoPath\package.json")) {
    Write-Host "❌ Error: Not in agentprivacy-zypher root directory" -ForegroundColor Red
    Write-Host "   Expected package.json at: $SourceRepoPath\package.json" -ForegroundColor Yellow
    exit 1
}

# If website repo path not provided, prompt
if ([string]::IsNullOrEmpty($WebsiteRepoPath)) {
    Write-Host "📁 Please provide the path to the agentprivacy website repository" -ForegroundColor Yellow
    Write-Host "   Example: C:\Users\mitch\agentprivacy" -ForegroundColor Gray
    $WebsiteRepoPath = Read-Host "Website repo path"
}

$WebsiteRepoPath = Resolve-Path $WebsiteRepoPath

if (-not (Test-Path "$WebsiteRepoPath\.git")) {
    Write-Host "❌ Error: Not a git repository: $WebsiteRepoPath" -ForegroundColor Red
    exit 1
}

Write-Host "Target Repo (website): $WebsiteRepoPath" -ForegroundColor Green
Write-Host ""

if ($DryRun) {
    Write-Host "🔍 DRY RUN MODE - No changes will be made" -ForegroundColor Yellow
    Write-Host ""
}

# Step 1: Check source repo is clean
Write-Host "Step 1: Checking source repo status..." -ForegroundColor Cyan
Push-Location $SourceRepoPath
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "⚠️  Warning: Source repo has uncommitted changes:" -ForegroundColor Yellow
    Write-Host $gitStatus -ForegroundColor Gray
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne "y") {
        exit 1
    }
}
Pop-Location

# Step 2: Navigate to website repo
Write-Host ""
Write-Host "Step 2: Preparing website repo..." -ForegroundColor Cyan
Push-Location $WebsiteRepoPath

# Check current branch
$currentBranch = git rev-parse --abbrev-ref HEAD
Write-Host "   Current branch: $currentBranch" -ForegroundColor Gray

# Create backup branch
$backupBranch = "backup-before-merge-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
Write-Host "   Creating backup branch: $backupBranch" -ForegroundColor Gray

if (-not $DryRun) {
    git checkout -b $backupBranch
    git push origin $backupBranch
    Write-Host "   ✓ Backup created" -ForegroundColor Green
    
    # Return to main
    git checkout $currentBranch
} else {
    Write-Host "   [DRY RUN] Would create backup branch: $backupBranch" -ForegroundColor Yellow
}

# Step 3: Add source repo as remote
Write-Host ""
Write-Host "Step 3: Adding source repo as remote..." -ForegroundColor Cyan

# Check if remote already exists
$remotes = git remote
if ($remotes -contains "zypher-source") {
    Write-Host "   Remote 'zypher-source' already exists, removing..." -ForegroundColor Gray
    if (-not $DryRun) {
        git remote remove zypher-source
    }
}

$sourceRepoUrl = "https://github.com/mitchuski/agentprivacy-zypher.git"
Write-Host "   Adding remote: zypher-source -> $sourceRepoUrl" -ForegroundColor Gray

if (-not $DryRun) {
    git remote add zypher-source $sourceRepoUrl
    git fetch zypher-source
    Write-Host "   ✓ Remote added and fetched" -ForegroundColor Green
} else {
    Write-Host "   [DRY RUN] Would add remote and fetch" -ForegroundColor Yellow
}

# Step 4: Show what will be merged
Write-Host ""
Write-Host "Step 4: Files to be merged..." -ForegroundColor Cyan

$filesToMerge = @(
    "src/",
    "public/",
    "package.json",
    "package-lock.json",
    "next.config.mjs",
    "tsconfig.json",
    "tailwind.config.ts",
    "postcss.config.js",
    "spellbook/",
    "docs/",
    ".gitignore",
    "README.md"
)

if (-not $KeepBackend) {
    $filesToMerge += "oracle-swordsman/"
}

Write-Host "   Files/directories from zypher repo:" -ForegroundColor Gray
foreach ($file in $filesToMerge) {
    Write-Host "     - $file" -ForegroundColor Gray
}

# Step 5: Perform merge
Write-Host ""
Write-Host "Step 5: Performing merge..." -ForegroundColor Cyan
Write-Host "   This will replace outdated files with production-ready code" -ForegroundColor Gray

if (-not $DryRun) {
    # Merge strategy: replace with zypher version
    Write-Host "   Merging with 'ours' strategy..." -ForegroundColor Gray
    git merge -s ours --allow-unrelated-histories --no-commit zypher-source/main
    
    Write-Host "   Removing old files..." -ForegroundColor Gray
    # Remove all files except .git
    Get-ChildItem -Path . -Exclude .git | Remove-Item -Recurse -Force
    
    Write-Host "   Copying files from zypher repo..." -ForegroundColor Gray
    git checkout zypher-source/main -- .
    
    # If keeping backend separate, remove it
    if ($KeepBackend) {
        if (Test-Path "oracle-swordsman") {
            Write-Host "   Removing oracle-swordsman (keeping in zypher repo)..." -ForegroundColor Gray
            Remove-Item -Recurse -Force "oracle-swordsman"
        }
    }
    
    Write-Host "   Staging changes..." -ForegroundColor Gray
    git add .
    
    Write-Host "   Committing merge..." -ForegroundColor Gray
    $commitMessage = @"
Replace outdated website with production-ready agentprivacy-zypher implementation

- Full Next.js 16 application with static export
- Story reader (13 Acts + 30 Zero tales)
- Mage chat interface (Soulbae)
- Proverbs gallery (onchain inscriptions)
- Production-ready with Acts 1-12 on Zcash mainnet
- Complete documentation and deployment guides

Merged from: https://github.com/mitchuski/agentprivacy-zypher
"@
    git commit -m $commitMessage
    
    Write-Host "   ✓ Merge completed" -ForegroundColor Green
} else {
    Write-Host "   [DRY RUN] Would perform merge and replace files" -ForegroundColor Yellow
}

# Step 6: Clean up
Write-Host ""
Write-Host "Step 6: Cleaning up..." -ForegroundColor Cyan

if (-not $DryRun) {
    git remote remove zypher-source
    Write-Host "   ✓ Removed temporary remote" -ForegroundColor Green
} else {
    Write-Host "   [DRY RUN] Would remove temporary remote" -ForegroundColor Yellow
}

# Step 7: Summary
Write-Host ""
Write-Host "✅ Merge Process Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Review the changes: git log" -ForegroundColor Gray
Write-Host "  2. Test locally: npm install && npm run build" -ForegroundColor Gray
Write-Host "  3. Test dev server: npm run dev" -ForegroundColor Gray
Write-Host "  4. Push to GitHub: git push origin $currentBranch" -ForegroundColor Gray
Write-Host "  5. Update deployment config (Vercel/Netlify/etc.)" -ForegroundColor Gray
Write-Host "  6. Set environment variables" -ForegroundColor Gray
Write-Host "  7. Deploy and test" -ForegroundColor Gray
Write-Host ""

if ($DryRun) {
    Write-Host "⚠️  This was a DRY RUN - no changes were made" -ForegroundColor Yellow
}

Pop-Location

Write-Host "📋 Backup branch created: $backupBranch" -ForegroundColor Green
Write-Host "   You can restore from it if needed: git checkout $backupBranch" -ForegroundColor Gray
Write-Host ""

