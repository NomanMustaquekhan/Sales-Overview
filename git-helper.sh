#!/bin/bash

# Git Helper Script for Sales Overview
# This script helps with common Git operations

echo "╔════════════════════════════════════════╗"
echo "║   Sales Overview - Git Helper Script   ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Function to display menu
show_menu() {
    echo "Select an option:"
    echo "1) Check Git status"
    echo "2) View commit history"
    echo "3) Create new branch"
    echo "4) Stage and commit changes"
    echo "5) Push changes"
    echo "6) Pull latest changes"
    echo "7) View branches"
    echo "8) Switch branch"
    echo "9) Exit"
    echo ""
}

# Main loop
while true; do
    show_menu
    read -p "Enter your choice [1-9]: " choice
    
    case $choice in
        1)
            echo ""
            echo "📊 Git Status:"
            git status
            echo ""
            ;;
        2)
            echo ""
            echo "📜 Commit History (Last 10):"
            git log --oneline -10
            echo ""
            ;;
        3)
            echo ""
            read -p "Enter branch name: " branch_name
            git checkout -b "$branch_name"
            echo "✅ Branch '$branch_name' created and checked out"
            echo ""
            ;;
        4)
            echo ""
            echo "📝 Staging and committing changes..."
            git status
            read -p "Enter commit message: " commit_msg
            git add .
            git commit -m "$commit_msg"
            echo "✅ Changes committed"
            echo ""
            ;;
        5)
            echo ""
            read -p "Enter branch name (default: main): " branch
            branch=${branch:-main}
            echo "🚀 Pushing to origin/$branch..."
            git push origin "$branch"
            echo "✅ Push complete"
            echo ""
            ;;
        6)
            echo ""
            read -p "Enter branch name (default: main): " branch
            branch=${branch:-main}
            echo "📥 Pulling from origin/$branch..."
            git pull origin "$branch"
            echo "✅ Pull complete"
            echo ""
            ;;
        7)
            echo ""
            echo "🌿 Available branches:"
            git branch -a
            echo ""
            ;;
        8)
            echo ""
            git branch -a
            read -p "Enter branch name to switch to: " branch_name
            git checkout "$branch_name"
            echo "✅ Switched to '$branch_name'"
            echo ""
            ;;
        9)
            echo "👋 Goodbye!"
            exit 0
            ;;
        *)
            echo "❌ Invalid option. Please try again."
            echo ""
            ;;
    esac
done
