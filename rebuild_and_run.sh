#!/bin/bash

echo "🧹 Cleaning native folders..."
rm -rf ios android

echo "🛠️ Rebuilding native project with iOS deployment target 15.0..."
npx expo prebuild --clean --platform ios

echo "📦 Installing CocoaPods..."
cd ios || exit 1
pod install --repo-update
cd ..

echo "🚀 Running on iOS..."
npx expo run:ios
