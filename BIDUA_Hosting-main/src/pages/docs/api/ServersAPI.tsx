import { DocLayout } from '../../../components/docs/DocLayout';
import { Server, RotateCw, Settings, Trash2, AlertCircle } from 'lucide-react';

export function ServersAPI() {
  return (
    <DocLayout
      title="Servers API"
      description="API documentation for server management, provisioning, and configuration."
      breadcrumbs={[{ label: 'API' }, { label: 'Servers' }]}
      prevPage={{ title: 'Payments API', path: '/docs/api/payments' }}
    >
      <div className="space-y-8">
        {/* Overview */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Servers API Overview</h2>
          <p className="text-slate-700 mb-4">
            The Servers API provides complete control over server resources - provisioning, configuration, monitoring, and management.
          </p>
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-6 border border-slate-200 space-y-3">
            <div>
              <h3 className="font-semibold text-slate-900">Server Statuses</h3>
              <p className="text-slate-700 text-sm">provisioning, active, suspended, terminated</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Supported Operating Systems</h3>
              <p className="text-slate-700 text-sm">Ubuntu 22.04 LTS, Ubuntu 20.04 LTS, CentOS 7, CentOS Stream 8, Debian 11, AlmaLinux 8</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Datacenters</h3>
              <p className="text-slate-700 text-sm">US-East, US-West, EU-West, APAC-Singapore, APAC-Tokyo, APAC-Mumbai</p>
            </div>
          </div>
        </section>

        {/* List Servers */}
        <section>
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-cyan-50 rounded-lg">
              <Server className="h-6 w-6 text-cyan-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">List User Servers</h2>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Endpoint</h3>
              <div className="bg-slate-900 rounded p-3 text-green-400 font-mono text-sm overflow-x-auto">
                GET /api/v1/servers
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Headers</h3>
              <div className="bg-slate-50 rounded p-3 font-mono text-sm">
                <div className="text-slate-700">Authorization: Bearer {'{token}'}</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Query Parameters</h3>
              <div className="bg-slate-50 rounded p-3 space-y-2 text-sm text-slate-700">
                <div><span className="font-semibold">skip</span> (optional) - Number of servers to skip (default: 0)</div>
                <div><span className="font-semibold">limit</span> (optional) - Number of servers to return (default: 10, max: 100)</div>
                <div><span className="font-semibold">status</span> (optional) - Filter by server status</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Response (200 OK)</h3>
              <div className="bg-slate-50 rounded p-4 overflow-x-auto">
                <pre className="text-slate-700 font-mono text-sm">{`{
  "servers": [
    {
      "id": 1,
      "hostname": "my-server.example.com",
      "ip_address": "203.0.113.42",
      "status": "active",
      "os_type": "Ubuntu 22.04 LTS",
      "cpu_cores": 2,
      "ram_gb": 4,
      "storage_gb": 80,
      "location": "US-East",
      "uptime_percent": 99.98,
      "order_id": 5,
      "created_at": "2024-01-15T10:45:00Z",
      "renewal_date": "2025-01-15T10:45:00Z"
    },
    {
      "id": 2,
      "hostname": "backup-server.example.com",
      "ip_address": "203.0.113.43",
      "status": "active",
      "os_type": "Ubuntu 20.04 LTS",
      "cpu_cores": 1,
      "ram_gb": 2,
      "storage_gb": 40,
      "location": "EU-West",
      "uptime_percent": 99.99,
      "order_id": 6,
      "created_at": "2024-01-10T15:20:00Z",
      "renewal_date": "2024-04-10T15:20:00Z"
    }
  ],
  "total": 2,
  "skip": 0,
  "limit": 10
}`}</pre>
              </div>
            </div>
          </div>
        </section>

        {/* Get Server Details */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Get Server Details</h2>

          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Endpoint</h3>
              <div className="bg-slate-900 rounded p-3 text-green-400 font-mono text-sm overflow-x-auto">
                GET /api/v1/servers/{'{server_id}'}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Headers</h3>
              <div className="bg-slate-50 rounded p-3 font-mono text-sm">
                <div className="text-slate-700">Authorization: Bearer {'{token}'}</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Response (200 OK)</h3>
              <div className="bg-slate-50 rounded p-4 overflow-x-auto">
                <pre className="text-slate-700 font-mono text-sm">{`{
  "id": 1,
  "hostname": "my-server.example.com",
  "ip_address": "203.0.113.42",
  "status": "active",
  "os_type": "Ubuntu 22.04 LTS",
  "root_password": "SecurePassword123!",
  "ssh_port": 22,
  "cpu_cores": 2,
  "ram_gb": 4,
  "storage_gb": 80,
  "bandwidth_gb": 500,
  "location": "US-East",
  "uptime_percent": 99.98,
  "order_id": 5,
  "user_id": 1,
  "created_at": "2024-01-15T10:45:00Z",
  "last_reboot": "2024-01-14T05:30:00Z",
  "renewal_date": "2025-01-15T10:45:00Z",
  "backup_available": true,
  "nameservers": [
    "ns1.bidua.com",
    "ns2.bidua.com"
  ],
  "dns_records": {
    "A": "203.0.113.42",
    "MX": "mail.example.com",
    "CNAME": []
  },
  "monitoring": {
    "cpu_usage": 24.5,
    "memory_usage": 62.3,
    "disk_usage": 45.8,
    "network_in_mbps": 12.3,
    "network_out_mbps": 8.5
  }
}`}</pre>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Possible Errors</h3>
              <div className="space-y-2">
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <p className="font-semibold text-red-900 text-sm">401 Unauthorized</p>
                  <p className="text-red-800 text-sm">Missing or invalid authentication token</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <p className="font-semibold text-red-900 text-sm">403 Forbidden</p>
                  <p className="text-red-800 text-sm">You don't have permission to access this server</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <p className="font-semibold text-red-900 text-sm">404 Not Found</p>
                  <p className="text-red-800 text-sm">Server with specified ID does not exist</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Update Server */}
        <section>
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Settings className="h-6 w-6 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Update Server Configuration</h2>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Endpoint</h3>
              <div className="bg-slate-900 rounded p-3 text-green-400 font-mono text-sm overflow-x-auto">
                PATCH /api/v1/servers/{'{server_id}'}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Headers</h3>
              <div className="bg-slate-50 rounded p-3 font-mono text-sm">
                <div className="text-slate-700">Authorization: Bearer {'{token}'}</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Request Body</h3>
              <div className="bg-slate-50 rounded p-4 overflow-x-auto">
                <pre className="text-slate-700 font-mono text-sm">{`{
  "hostname": "new-hostname.example.com",
  "ssh_port": 2222,
  "root_password": "NewSecurePassword456!",
  "label": "Production Server",
  "tags": ["production", "critical"]
}`}</pre>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Response (200 OK)</h3>
              <div className="bg-slate-50 rounded p-4 overflow-x-auto">
                <pre className="text-slate-700 font-mono text-sm">{`{
  "message": "Server updated successfully",
  "server": {
    "id": 1,
    "hostname": "new-hostname.example.com",
    "ssh_port": 2222,
    "updated_at": "2024-01-15T12:00:00Z"
  }
}`}</pre>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Updatable Fields</h3>
              <div className="bg-slate-50 rounded p-3 space-y-1 text-sm text-slate-700">
                <div>• hostname - Server hostname/FQDN</div>
                <div>• ssh_port - SSH access port</div>
                <div>• root_password - Root account password</div>
                <div>• label - Custom label for server</div>
                <div>• tags - Custom tags for organization</div>
              </div>
            </div>
          </div>
        </section>

        {/* Reboot Server */}
        <section>
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-purple-50 rounded-lg">
              <RotateCw className="h-6 w-6 text-purple-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Reboot Server</h2>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Endpoint</h3>
              <div className="bg-slate-900 rounded p-3 text-green-400 font-mono text-sm overflow-x-auto">
                POST /api/v1/servers/{'{server_id}'}/reboot
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Headers</h3>
              <div className="bg-slate-50 rounded p-3 font-mono text-sm">
                <div className="text-slate-700">Authorization: Bearer {'{token}'}</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Request Body</h3>
              <div className="bg-slate-50 rounded p-4 overflow-x-auto">
                <pre className="text-slate-700 font-mono text-sm">{`{
  "reboot_type": "soft"  // soft or hard
}`}</pre>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Response (200 OK)</h3>
              <div className="bg-slate-50 rounded p-4 overflow-x-auto">
                <pre className="text-slate-700 font-mono text-sm">{`{
  "message": "Server reboot initiated",
  "server_id": 1,
  "estimated_time": 120,
  "reboot_type": "soft"
}`}</pre>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Reboot Types</h3>
              <div className="space-y-2">
                <div className="bg-blue-50 border border-blue-200 rounded p-3">
                  <p className="font-semibold text-blue-900 text-sm">Soft Reboot</p>
                  <p className="text-blue-800 text-sm">Graceful shutdown (1-2 minutes). Use for normal reboot.</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <p className="font-semibold text-red-900 text-sm">Hard Reboot</p>
                  <p className="text-red-800 text-sm">Force restart (30 seconds). Use only if soft reboot fails.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Create Backup */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Create Server Backup</h2>

          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Endpoint</h3>
              <div className="bg-slate-900 rounded p-3 text-green-400 font-mono text-sm overflow-x-auto">
                POST /api/v1/servers/{'{server_id}'}/backup
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Headers</h3>
              <div className="bg-slate-50 rounded p-3 font-mono text-sm">
                <div className="text-slate-700">Authorization: Bearer {'{token}'}</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Request Body</h3>
              <div className="bg-slate-50 rounded p-4 overflow-x-auto">
                <pre className="text-slate-700 font-mono text-sm">{`{
  "description": "Pre-deployment backup",
  "backup_type": "full"  // full or incremental
}`}</pre>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Response (201 Created)</h3>
              <div className="bg-slate-50 rounded p-4 overflow-x-auto">
                <pre className="text-slate-700 font-mono text-sm">{`{
  "backup_id": "backup_123abc456",
  "server_id": 1,
  "description": "Pre-deployment backup",
  "status": "in_progress",
  "backup_type": "full",
  "estimated_time": 300,
  "created_at": "2024-01-15T12:00:00Z",
  "size_gb": null
}`}</pre>
              </div>
            </div>
          </div>
        </section>

        {/* Terminate Server */}
        <section>
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-red-50 rounded-lg">
              <Trash2 className="h-6 w-6 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Terminate Server</h2>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-900 text-sm flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <span>This action is permanent. All data on the server will be deleted. Create a backup first if needed.</span>
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Endpoint</h3>
              <div className="bg-slate-900 rounded p-3 text-green-400 font-mono text-sm overflow-x-auto">
                DELETE /api/v1/servers/{'{server_id}'}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Headers</h3>
              <div className="bg-slate-50 rounded p-3 font-mono text-sm">
                <div className="text-slate-700">Authorization: Bearer {'{token}'}</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Query Parameters</h3>
              <div className="bg-slate-50 rounded p-3 space-y-2 text-sm text-slate-700">
                <div><span className="font-semibold">confirm</span> (required) - Must be "yes" to confirm termination</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Response (200 OK)</h3>
              <div className="bg-slate-50 rounded p-4 overflow-x-auto">
                <pre className="text-slate-700 font-mono text-sm">{`{
  "message": "Server termination initiated",
  "server_id": 1,
  "status": "terminated",
  "data_deletion_scheduled": "2024-01-22T12:00:00Z"
}`}</pre>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Possible Errors</h3>
              <div className="space-y-2">
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <p className="font-semibold text-red-900 text-sm">400 Bad Request</p>
                  <p className="text-red-800 text-sm">Confirmation not provided or invalid value</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <p className="font-semibold text-red-900 text-sm">403 Forbidden</p>
                  <p className="text-red-800 text-sm">Server cannot be terminated (e.g., still within protection period)</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Server Monitoring */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Monitor Server Performance</h2>

          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Endpoint</h3>
              <div className="bg-slate-900 rounded p-3 text-green-400 font-mono text-sm overflow-x-auto">
                GET /api/v1/servers/{'{server_id}'}/metrics
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Query Parameters</h3>
              <div className="bg-slate-50 rounded p-3 space-y-2 text-sm text-slate-700">
                <div><span className="font-semibold">period</span> (optional) - 1h, 6h, 24h, 7d, 30d (default: 24h)</div>
                <div><span className="font-semibold">metric</span> (optional) - cpu, memory, disk, network (default: all)</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Response (200 OK)</h3>
              <div className="bg-slate-50 rounded p-4 overflow-x-auto">
                <pre className="text-slate-700 font-mono text-sm">{`{
  "server_id": 1,
  "period": "24h",
  "metrics": {
    "cpu": {
      "current": 24.5,
      "average": 18.3,
      "peak": 67.2,
      "history": [...]
    },
    "memory": {
      "current": 2.4,
      "average": 2.1,
      "peak": 3.8,
      "total": 4.0,
      "usage_percent": 60.0,
      "history": [...]
    },
    "disk": {
      "current": 36.6,
      "average": 34.2,
      "peak": 41.0,
      "total": 80.0,
      "usage_percent": 45.8,
      "history": [...]
    },
    "network": {
      "in_mbps": 12.3,
      "out_mbps": 8.5,
      "peak_in": 45.2,
      "peak_out": 32.1,
      "history": [...]
    }
  }
}`}</pre>
              </div>
            </div>
          </div>
        </section>

        {/* Common Operations */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Common Server Operations</h2>
          <div className="space-y-3">
            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 mb-2">SSH Connection</h3>
              <div className="bg-slate-900 rounded p-3 text-green-400 font-mono text-sm overflow-x-auto">
                <code>ssh root@203.0.113.42 -p 22</code>
              </div>
              <p className="text-slate-700 text-sm mt-2">Use hostname or IP from server details. Default SSH port: 22</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 mb-2">Change Hostname</h3>
              <div className="bg-slate-900 rounded p-3 text-green-400 font-mono text-sm overflow-x-auto">
                <code>hostnamectl set-hostname my-server.example.com</code>
              </div>
              <p className="text-slate-700 text-sm mt-2">Update via API then ssh into server and run this command</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 mb-2">Change SSH Port</h3>
              <div className="bg-slate-900 rounded p-3 text-green-400 font-mono text-sm overflow-x-auto">
                <code>sed -i 's/#Port 22/Port 2222/' /etc/ssh/sshd_config</code>
              </div>
              <p className="text-slate-700 text-sm mt-2">Update API first, then execute on server and restart SSH</p>
            </div>
          </div>
        </section>

        {/* Next Steps */}
        <section className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-8 border border-cyan-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">API Documentation Complete</h2>
          <p className="text-slate-700 mb-6">
            You now have a complete understanding of the BIDUA Hosting platform APIs. Review the implementation guides and start integrating!
          </p>
          <div className="space-y-3">
            <a
              href="/docs"
              className="inline-block px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition font-medium"
            >
              Back to Documentation Home →
            </a>
          </div>
        </section>
      </div>
    </DocLayout>
  );
}
