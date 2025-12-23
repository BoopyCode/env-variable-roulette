#!/usr/bin/env node

// ENV Roulette - Because debugging environment variables should feel like gambling!
// Spin the wheel and see if your app crashes or... actually works (unlikely)

const fs = require('fs');
const path = require('path');

// The main event - where dreams of stable deployments go to die
function playEnvRoulette() {
    console.log('🎰 Spinning the ENV Roulette wheel...');
    console.log('💀 May the odds be ever in your favor (they won\'t be)\n');
    
    // Look for the most common env file names - because consistency is for cowards
    const envFiles = ['.env', '.env.local', '.env.development', '.env.production'];
    let foundEnv = null;
    
    // Hunt for that elusive .env file like it's Waldo
    for (const envFile of envFiles) {
        if (fs.existsSync(envFile)) {
            foundEnv = envFile;
            console.log(`🎯 Found ${envFile}! Because who needs consistent naming?`);
            break;
        }
    }
    
    if (!foundEnv) {
        console.log('❌ No .env file found. Your app will probably crash. Surprise!');
        console.log('💡 Pro tip: Create a .env file. Or don\'t. I\'m not your mom.');
        return;
    }
    
    // Read the env file - hope you like parsing errors!
    let envContent;
    try {
        envContent = fs.readFileSync(foundEnv, 'utf8');
    } catch (error) {
        console.log(`📖 Can\'t read ${foundEnv}. Maybe it\'s shy? Error: ${error.message}`);
        return;
    }
    
    // Parse with the sophistication of a drunk regex
    const lines = envContent.split('\n');
    const variables = [];
    const issues = [];
    
    lines.forEach((line, index) => {
        line = line.trim();
        
        // Skip comments and empty lines - because reading is hard
        if (!line || line.startsWith('#')) return;
        
        // The world's most forgiving env parser (too forgiving, really)
        const match = line.match(/^([A-Z_][A-Z0-9_]*)=?(.*)$/);
        
        if (match) {
            const key = match[1];
            const value = match[2] || '';
            
            variables.push({ key, value, line: index + 1 });
            
            // Look for common "features" (bugs)
            if (value === '') {
                issues.push(`⚠️  Line ${index + 1}: ${key} has empty value. Hope that's intentional!`);
            }
            if (value.includes(' ')) {
                issues.push(`⚠️  Line ${index + 1}: ${key} has spaces. Quoting is for quitters!`);
            }
            if (key.includes('SECRET') && value.length < 10) {
                issues.push(`⚠️  Line ${index + 1}: ${key} looks weak. Hackers love easy mode!`);
            }
        } else {
            issues.push(`❌ Line ${index + 1}: Can't parse "${line}". Is this even English?`);
        }
    });
    
    // The moment of truth - will your app survive?
    console.log(`📊 Found ${variables.length} environment variables:`);
    variables.forEach(v => {
        const displayValue = v.key.includes('SECRET') || v.key.includes('KEY') 
            ? '********' 
            : v.value;
        console.log(`   ${v.key}=${displayValue}`);
    });
    
    console.log('\n🔍 Issues found:');
    if (issues.length === 0) {
        console.log('   🎉 None! Your config is... suspiciously perfect. Did you cheat?');
    } else {
        issues.forEach(issue => console.log(`   ${issue}`));
        console.log(`\n💀 Found ${issues.length} potential issues. Good luck with that!`);
    }
    
    console.log('\n🎲 Roulette complete! Your app has a', 
        issues.length === 0 ? '100%' : `${Math.max(10, 100 - issues.length * 10)}%`, 
        'chance of working. Probably.'
    );
}

// Let's gamble!
if (require.main === module) {
    playEnvRoulette();
}

module.exports = { playEnvRoulette };