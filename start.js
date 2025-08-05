// Start script for Render deployment
import { spawn } from 'child_process';

console.log('🚀 Starting FitPlan application...');

const child = spawn('npm', ['start'], {
  stdio: 'inherit',
  shell: true
});

child.on('error', (error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});

child.on('exit', (code) => {
  console.log(`Application exited with code ${code}`);
  process.exit(code);
}); 