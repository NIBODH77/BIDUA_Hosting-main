import { DocLayout } from '../../../components/docs/DocLayout';
import { Server, RefreshCw, Power, Terminal, Sliders, HardDrive } from 'lucide-react';

export function UserServers() {
  return (
    <DocLayout
      title="Managing Your Servers"
      description="Complete guide to server management and control"
      breadcrumbs={[
        { label: 'User Guides', path: '/docs/user' },
        { label: 'Managing Servers' }
      ]}
      prevPage={{ title: 'How to Purchase', path: '/docs/user/purchase' }}
      nextPage={{ title: 'Billing & Payments', path: '/docs/user/billing' }}
    >
      <div className="space-y-8">
        {/* Overview */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Overview</h2>
          <p className="text-slate-600 mb-4">
            Once your server is provisioned, you can manage it through the control panel. This guide covers common server management tasks including starting, stopping, rebooting, and monitoring.
          </p>
        </section>

        {/* Dashboard Overview */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Control Panel Overview</h2>

          <p className="text-slate-600 mb-6">
            Access your servers from the control panel:
          </p>

          <ol className="space-y-3 mb-6">
            <li className="flex items-start space-x-3">
              <span className="font-bold text-cyan-500">1</span>
              <span className="text-slate-600">Log into your dashboard</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="font-bold text-cyan-500">2</span>
              <span className="text-slate-600">Click "My Servers" from the sidebar</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="font-bold text-cyan-500">3</span>
              <span className="text-slate-600">View all your active servers</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="font-bold text-cyan-500">4</span>
              <span className="text-slate-600">Click server name to manage it</span>
            </li>
          </ol>

          <div className="border border-slate-200 rounded-lg p-6 bg-slate-50">
            <h3 className="font-semibold text-slate-900 mb-4">Server Information Panel</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-600">Server Name:</span>
                <span className="font-semibold">my-hosting.server</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-600">IP Address:</span>
                <span className="font-mono">192.168.1.100</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-600">Status:</span>
                <span className="text-green-600 font-semibold">Running</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-600">Operating System:</span>
                <span>Ubuntu 22.04 LTS</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Creation Date:</span>
                <span>Nov 15, 2024</span>
              </div>
            </div>
          </div>
        </section>

        {/* Server Control */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Server Control Operations</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            {[
              {
                icon: Power,
                title: 'Power On',
                description: 'Start a powered-off server',
                steps: ['Select server', 'Click Power On', 'Wait for startup (2-5 min)']
              },
              {
                icon: Power,
                title: 'Power Off',
                description: 'Gracefully shut down the server',
                steps: ['Select server', 'Click Power Off', 'Confirm action', 'Wait for shutdown']
              },
              {
                icon: RefreshCw,
                title: 'Reboot',
                description: 'Restart the server (recommended for updates)',
                steps: ['Select server', 'Click Reboot', 'Confirm', 'Server restarts']
              },
              {
                icon: Terminal,
                title: 'Force Reboot',
                description: 'Hard reboot if server is unresponsive',
                steps: ['Select server', 'Click Force Reboot', 'Confirm (may cause data loss)']
              }
            ].map((operation, index) => {
              const Icon = operation.icon;
              return (
                <div key={index} className="border border-slate-200 rounded-lg p-4">
                  <Icon className="h-6 w-6 text-cyan-500 mb-3" />
                  <h3 className="font-semibold text-slate-900 mb-2">{operation.title}</h3>
                  <p className="text-slate-600 text-sm mb-3">{operation.description}</p>
                  <div className="bg-slate-50 p-2 rounded text-xs space-y-1">
                    {operation.steps.map((step, idx) => (
                      <p key={idx} className="text-slate-600">• {step}</p>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Server Monitoring */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Server Monitoring</h2>

          <p className="text-slate-600 mb-6">
            Monitor your server's performance and resource usage:
          </p>

          <h3 className="text-lg font-semibold text-slate-900 mb-4">Real-time Metrics</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            {[
              {
                metric: 'CPU Usage',
                icon: '⚙️',
                value: '45%',
                description: 'Current processor utilization',
                threshold: 'Alert at 80%+'
              },
              {
                metric: 'Memory (RAM)',
                icon: '💾',
                value: '3.2GB / 8GB',
                description: 'Used vs total RAM',
                threshold: 'Alert at 85%+'
              },
              {
                metric: 'Disk Space',
                icon: '📦',
                value: '250GB / 500GB',
                description: 'Storage utilization',
                threshold: 'Alert at 90%+'
              },
              {
                metric: 'Network',
                icon: '🌐',
                value: '125 Mbps',
                description: 'Current bandwidth usage',
                threshold: 'Alert at 95%+'
              }
            ].map((item, index) => (
              <div key={index} className="border border-slate-200 rounded-lg p-4">
                <p className="text-sm text-slate-600 mb-1">{item.metric}</p>
                <p className="text-2xl font-bold text-cyan-500 mb-2">{item.value}</p>
                <p className="text-sm text-slate-600 mb-2">{item.description}</p>
                <p className="text-xs text-amber-600">{item.threshold}</p>
              </div>
            ))}
          </div>

          <h3 className="text-lg font-semibold text-slate-900 mb-4">Viewing Detailed Graphs</h3>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
            <ol className="space-y-2 text-slate-600">
              <li>1. Go to Monitoring tab in server details</li>
              <li>2. View graphs for last hour, day, week, month</li>
              <li>3. Hover over graphs for specific values</li>
              <li>4. Export data for external analysis</li>
              <li>5. Set up custom alerts for thresholds</li>
            </ol>
          </div>
        </section>

        {/* Resource Management */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Resource Management</h2>

          <h3 className="text-lg font-semibold text-slate-900 mb-4">Upgrading Resources</h3>

          <div className="border border-slate-200 rounded-lg p-6 mb-6">
            <p className="text-slate-600 mb-4">
              Upgrade your server resources anytime without downtime:
            </p>

            <ol className="space-y-4">
              <li className="flex items-start space-x-4">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">1</span>
                <div>
                  <p className="font-semibold text-slate-900">Go to Manage Resources</p>
                  <p className="text-slate-600 text-sm">Click "Upgrade" button on server details</p>
                </div>
              </li>
              <li className="flex items-start space-x-4">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">2</span>
                <div>
                  <p className="font-semibold text-slate-900">Select New Configuration</p>
                  <p className="text-slate-600 text-sm">Choose new CPU, RAM, or storage levels</p>
                </div>
              </li>
              <li className="flex items-start space-x-4">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">3</span>
                <div>
                  <p className="font-semibold text-slate-900">Review Cost</p>
                  <p className="text-slate-600 text-sm">See pro-rated charges for remaining billing period</p>
                </div>
              </li>
              <li className="flex items-start space-x-4">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm">4</span>
                <div>
                  <p className="font-semibold text-slate-900">Confirm & Apply</p>
                  <p className="text-slate-600 text-sm">Changes take effect immediately</p>
                </div>
              </li>
            </ol>
          </div>

          <h3 className="text-lg font-semibold text-slate-900 mb-4">Downgrading Resources</h3>

          <p className="text-slate-600 mb-4">
            Reduce resources to lower your costs:
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-amber-900 text-sm">
              Note: Downgrades may require service restart and are subject to availability. Ensure your current usage fits the new plan size.
            </p>
          </div>
        </section>

        {/* Storage Management */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Storage & Backups</h2>

          <h3 className="text-lg font-semibold text-slate-900 mb-4">Managing Storage</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            <div className="border border-slate-200 rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 mb-3">Expand Storage</h4>
              <ol className="space-y-2 text-slate-600 text-sm">
                <li>1. Go to Storage section</li>
                <li>2. Click "Expand Storage"</li>
                <li>3. Choose new size</li>
                <li>4. Confirm (usually instant)</li>
              </ol>
            </div>

            <div className="border border-slate-200 rounded-lg p-4">
              <h4 className="font-semibold text-slate-900 mb-3">View Disk Usage</h4>
              <ol className="space-y-2 text-slate-600 text-sm">
                <li>1. Open File Manager</li>
                <li>2. View directory sizes</li>
                <li>3. Identify large files</li>
                <li>4. Delete unnecessary data</li>
              </ol>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-slate-900 mb-4">Backup Management</h3>

          <div className="border border-slate-200 rounded-lg p-6">
            <h4 className="font-semibold text-slate-900 mb-4 flex items-center space-x-2">
              <HardDrive className="h-5 w-5 text-cyan-500" />
              <span>Creating Backups</span>
            </h4>

            <ol className="space-y-3 text-slate-600">
              <li>1. Go to Backups section in server details</li>
              <li>2. Click "Create New Backup"</li>
              <li>3. Backup runs in background (may take 1-10 min)</li>
              <li>4. Backup listed with timestamp when complete</li>
              <li>5. Keep recent backups for recovery</li>
            </ol>

            <h4 className="font-semibold text-slate-900 mt-4 mb-3">Backup Options</h4>

            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2 p-2 border border-slate-200 rounded">
                <input type="radio" name="backup" />
                <label className="text-slate-600">Full System Backup (includes everything)</label>
              </div>
              <div className="flex items-center space-x-2 p-2 border border-slate-200 rounded">
                <input type="radio" name="backup" />
                <label className="text-slate-600">File System Only (excluding OS)</label>
              </div>
              <div className="flex items-center space-x-2 p-2 border border-slate-200 rounded">
                <input type="radio" name="backup" />
                <label className="text-slate-600">Database Backup (MySQL, PostgreSQL)</label>
              </div>
            </div>
          </div>
        </section>

        {/* SSH Access */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">SSH Access & Terminal</h2>

          <p className="text-slate-600 mb-6">
            Access your server via SSH for advanced management:
          </p>

          <h3 className="text-lg font-semibold text-slate-900 mb-4">Connection Details</h3>

          <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-sm mb-6 overflow-x-auto">
            <p>ssh root@192.168.1.100</p>
            <p className="mt-2 text-slate-500"># When prompted, enter your password</p>
          </div>

          <h3 className="text-lg font-semibold text-slate-900 mb-4">Common SSH Commands</h3>

          <div className="space-y-3 mb-6">
            {[
              { cmd: 'uname -a', desc: 'System information' },
              { cmd: 'df -h', desc: 'Disk space usage' },
              { cmd: 'free -h', desc: 'Memory usage' },
              { cmd: 'top', desc: 'Running processes' },
              { cmd: 'systemctl status', desc: 'Service status' },
              { cmd: 'sudo reboot', desc: 'Reboot server' }
            ].map((item, idx) => (
              <div key={idx} className="border border-slate-200 rounded-lg p-3">
                <p className="font-mono bg-slate-900 text-cyan-400 p-2 rounded mb-2 text-sm overflow-x-auto">{item.cmd}</p>
                <p className="text-slate-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Network Configuration */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Network Configuration</h2>

          <h3 className="text-lg font-semibold text-slate-900 mb-4">IP Addresses</h3>

          <div className="border border-slate-200 rounded-lg p-6 mb-6">
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-slate-900 mb-2">Primary IP Address</p>
                <p className="font-mono bg-slate-50 p-2 rounded text-slate-600">192.168.1.100</p>
                <p className="text-slate-600 text-sm mt-1">Used for SSH, HTTP/HTTPS, and other services</p>
              </div>

              <div>
                <p className="font-semibold text-slate-900 mb-2">Additional IPs</p>
                <p className="text-slate-600 text-sm mb-2">You can add more IPs from the control panel</p>
                <button className="px-3 py-1 bg-cyan-500 text-white rounded text-sm hover:bg-cyan-600">Add IP Address</button>
              </div>

              <div>
                <p className="font-semibold text-slate-900 mb-2">Reverse DNS</p>
                <p className="text-slate-600 text-sm">Configure reverse DNS for mail servers and other services</p>
              </div>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-slate-900 mb-4">Firewall Rules</h3>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-900 mb-3">Manage firewall to allow/block ports and IP addresses:</p>
            <ul className="space-y-1 text-blue-900 text-sm">
              <li>• Open ports for services (HTTP 80, HTTPS 443, SSH 22)</li>
              <li>• Block unnecessary ports</li>
              <li>• Whitelist/blacklist IP addresses</li>
              <li>• Create custom firewall rules</li>
            </ul>
          </div>
        </section>

        {/* Tips */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Helpful Tips</h2>

          <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
            <ul className="space-y-2 text-slate-700">
              <li>• Monitor resource usage regularly to avoid bottlenecks</li>
              <li>• Create backups before major changes</li>
              <li>• Use strong passwords for SSH access</li>
              <li>• Keep software and OS updated</li>
              <li>• Set up alerts for high resource usage</li>
              <li>• Review server logs for issues</li>
              <li>• Contact support if you need assistance</li>
            </ul>
          </div>
        </section>
      </div>
    </DocLayout>
  );
}
