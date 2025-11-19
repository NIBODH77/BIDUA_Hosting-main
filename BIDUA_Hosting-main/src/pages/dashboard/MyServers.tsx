import { Server, Power, PowerOff, RefreshCw, Settings, MoreVertical, Info, X, DollarSign, Package, Shield, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { api } from '../../lib/api';

interface ServerData {
  id: number;
  server_name: string;
  hostname: string;
  server_status: string;
  ip_address?: string;
  plan_name?: string;
  vcpu?: number;
  ram_gb?: number;
  storage_gb?: number;
  bandwidth_gb?: number;
  operating_system?: string;
  created_date?: string;
  expiry_date?: string;
  monthly_cost?: number | string;
  billing_cycle?: string;
  specs?: {
    addons?: Array<{
      name: string;
      price: number;
      quantity?: number;
    }>;
    services?: Array<{
      name: string;
      price: number;
    }>;
    [key: string]: any;
  };
  addons?: Array<{
    name: string;
    price: number;
    billing_cycle?: string;
  }>;
  services?: Array<{
    name: string;
    price: number;
  }>;
}

export function MyServers() {
  const [servers, setServers] = useState<ServerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedServer, setSelectedServer] = useState<ServerData | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showNoServerBanner, setShowNoServerBanner] = useState<boolean>(() => {
    try {
      // Persist dismissal per-user if available later
      return localStorage.getItem('dismiss_no_server_banner') !== 'true';
    } catch {
      return true;
    }
  });

  useEffect(() => {
    loadServers();
  }, []);

  const loadServers = async () => {
    try {
      setLoading(true);
      const response = await api.getServers();
      const serversArray: ServerData[] = Array.isArray(response) ? response : (response as { servers?: ServerData[] })?.servers || [];
      setServers(serversArray);
    } catch (error) {
      console.error('Failed to load servers:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-700',
      stopped: 'bg-slate-800 text-slate-300',
      provisioning: 'bg-blue-100 text-blue-700',
      error: 'bg-red-100 text-red-700',
    };
    return colors[status as keyof typeof colors] || colors.stopped;
  };

  const handleShowDetails = (server: ServerData) => {
    setSelectedServer(server);
    setShowDetailsModal(true);
  };

  const handleCloseDetails = () => {
    setShowDetailsModal(false);
    setSelectedServer(null);
  };

  return (
    <div className="space-y-6 w-full h-full overflow-y-auto pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-2 sm:px-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">My Servers</h2>
          <p className="text-sm sm:text-base text-slate-400">Manage and monitor all your servers</p>
        </div>
        <Link
          to="/pricing"
          className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition font-semibold border-2 border-cyan-500 text-center text-sm sm:text-base"
        >
          Deploy New Server
        </Link>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-400">
          <p>Loading servers...</p>
        </div>
      ) : servers.length === 0 ? (
        <div className="space-y-3 px-2 sm:px-0">
          {showNoServerBanner && (
            <div className="flex items-start sm:items-center justify-between gap-3 bg-cyan-500/10 border border-cyan-500/30 text-cyan-100 rounded-lg p-3 sm:p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                  <Server className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-400" />
                </div>
                <div>
                  <div className="text-white font-semibold text-sm sm:text-base">No servers yet</div>
                  <div className="text-xs sm:text-sm text-cyan-100">
                    Deploy your first server to get started. You can pick a plan that fits your needs.
                  </div>
                </div>
              </div>
              <button
                aria-label="Dismiss"
                className="text-cyan-300 hover:text-white text-xs sm:text-sm"
                onClick={() => {
                  try { localStorage.setItem('dismiss_no_server_banner', 'true'); } catch {}
                  setShowNoServerBanner(false);
                }}
              >
                ✕
              </button>
            </div>
          )}

          <div className="bg-slate-900 rounded-lg border border-cyan-500/30 p-4 text-center">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-1">No Servers Found</h3>
            <p className="text-slate-400 mb-4 text-sm">Deploy your first server to get started.</p>
            <Link
              to="/pricing"
              className="inline-block px-4 sm:px-5 py-2 sm:py-2.5 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition font-semibold border border-cyan-500 text-sm"
            >
              View Plans
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:gap-6 px-2 sm:px-0">
          {servers.map((server) => (
            <div key={server.id} className="bg-slate-900 rounded-xl shadow-sm border-2 border-cyan-500 overflow-hidden hover:shadow-lg hover:shadow-cyan-500/30 transition">
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                  <div className="flex items-start space-x-3 sm:space-x-4 flex-1">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Server className="h-5 w-5 sm:h-6 sm:w-6 text-cyan-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-white mb-1 truncate">{server.server_name}</h3>
                      <p className="text-xs sm:text-sm text-slate-400 mb-2 truncate">{server.hostname}</p>
                      <span className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(server.server_status)}`}>
                        {server.server_status}
                      </span>
                    </div>
                  </div>
                  <button className="text-slate-400 hover:text-cyan-400 self-start">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 mb-4 sm:mb-6 bg-slate-950 p-3 sm:p-4 rounded-lg border-2 border-cyan-500/50">
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Plan</p>
                    <p className="text-sm sm:text-base font-semibold text-white truncate">{server.plan_name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">IP Address</p>
                    <p className="text-sm sm:text-base font-semibold text-white truncate">{server.ip_address || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Resources</p>
                    <p className="text-sm sm:text-base font-semibold text-white">{server.vcpu || 0} vCPU, {server.ram_gb || 0}GB</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Storage</p>
                    <p className="text-sm sm:text-base font-semibold text-white">{server.storage_gb || 0}GB NVMe</p>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <p className="text-xs text-slate-400 mb-1">OS</p>
                    <p className="text-sm sm:text-base font-semibold text-white truncate">{server.operating_system || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-cyan-500">
                  <div className="text-xs sm:text-sm text-slate-400">
                    {server.created_date && (
                      <>
                        Created: {new Date(server.created_date).toLocaleDateString()}
                        {server.expiry_date && (
                          <>
                            {' • '}
                            Expires: {new Date(server.expiry_date).toLocaleDateString()}
                          </>
                        )}
                      </>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {server.server_status === 'active' ? (
                      <button className="px-3 sm:px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition font-semibold flex items-center space-x-2 text-xs sm:text-sm">
                        <PowerOff className="h-4 w-4" />
                        <span className="hidden sm:inline">Stop</span>
                      </button>
                    ) : (
                      <button className="px-3 sm:px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition font-semibold flex items-center space-x-2 text-xs sm:text-sm">
                        <Power className="h-4 w-4" />
                        <span className="hidden sm:inline">Start</span>
                      </button>
                    )}
                    <button className="px-3 sm:px-4 py-2 bg-slate-800 text-slate-300 border border-slate-600 rounded-lg hover:bg-slate-700 transition font-semibold flex items-center space-x-2 text-xs sm:text-sm">
                      <RefreshCw className="h-4 w-4" />
                      <span className="hidden sm:inline">Reboot</span>
                    </button>
                    <button 
                      onClick={() => handleShowDetails(server)}
                      className="px-3 sm:px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition font-semibold flex items-center space-x-2 text-xs sm:text-sm"
                    >
                      <Info className="h-4 w-4" />
                      <span className="hidden sm:inline">Details</span>
                    </button>
                    <Link
                      to={`/dashboard/servers/${server.id}`}
                      className="px-3 sm:px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition font-semibold flex items-center space-x-2 border-2 border-cyan-500 text-xs sm:text-sm"
                    >
                      <Settings className="h-4 w-4" />
                      <span className="hidden sm:inline">Manage</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Server Details Modal */}
      {showDetailsModal && selectedServer && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl border-2 border-cyan-500 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-slate-900 border-b border-cyan-500/30 p-4 sm:p-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">{selectedServer.server_name}</h3>
                <p className="text-sm text-slate-400">{selectedServer.hostname}</p>
              </div>
              <button
                onClick={handleCloseDetails}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6 space-y-6">
              {/* Server Configuration */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                  <Cpu className="h-5 w-5 text-cyan-400" />
                  <span>Server Configuration</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-950 p-4 rounded-lg border border-cyan-500/30">
                    <p className="text-xs text-slate-400 mb-1">vCPU Cores</p>
                    <p className="text-lg font-bold text-white">{selectedServer.vcpu || 0}</p>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-lg border border-cyan-500/30">
                    <p className="text-xs text-slate-400 mb-1">RAM</p>
                    <p className="text-lg font-bold text-white">{selectedServer.ram_gb || 0} GB</p>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-lg border border-cyan-500/30">
                    <p className="text-xs text-slate-400 mb-1">Storage</p>
                    <p className="text-lg font-bold text-white">{selectedServer.storage_gb || 0} GB</p>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-lg border border-cyan-500/30">
                    <p className="text-xs text-slate-400 mb-1">Operating System</p>
                    <p className="text-sm font-semibold text-white">{selectedServer.operating_system || 'N/A'}</p>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-lg border border-cyan-500/30">
                    <p className="text-xs text-slate-400 mb-1">IP Address</p>
                    <p className="text-sm font-semibold text-white">{selectedServer.ip_address || 'Pending'}</p>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-lg border border-cyan-500/30">
                    <p className="text-xs text-slate-400 mb-1">Status</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedServer.server_status)}`}>
                      {selectedServer.server_status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Billing Information */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-cyan-400" />
                  <span>Billing Information</span>
                </h4>
                <div className="bg-slate-950 p-4 rounded-lg border border-cyan-500/30 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Plan:</span>
                    <span className="text-white font-semibold">{selectedServer.plan_name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Monthly Cost:</span>
                    <span className="text-white font-semibold">₹{Number(selectedServer.monthly_cost || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Billing Cycle:</span>
                    <span className="text-white font-semibold capitalize">
                      {selectedServer.billing_cycle === 'semiannually' ? 'Semi-Annually' :
                       selectedServer.billing_cycle === 'biennially' ? 'Biennially' :
                       selectedServer.billing_cycle === 'triennially' ? 'Triennially' :
                       selectedServer.billing_cycle || 'Monthly'}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-cyan-500/30 pt-3">
                    <span className="text-slate-400">Created:</span>
                    <span className="text-white font-semibold">
                      {selectedServer.created_date ? new Date(selectedServer.created_date).toLocaleDateString('en-GB') : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Expires:</span>
                    <span className="text-white font-semibold">
                      {selectedServer.expiry_date ? new Date(selectedServer.expiry_date).toLocaleDateString('en-GB') : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Add-ons - Check both specs.addons and addons array */}
              {((selectedServer.specs?.addons && selectedServer.specs.addons.length > 0) || 
                (selectedServer.addons && selectedServer.addons.length > 0)) && (
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                    <Package className="h-5 w-5 text-cyan-400" />
                    <span>Active Add-ons</span>
                  </h4>
                  <div className="space-y-2">
                    {/* Render from specs.addons if available */}
                    {selectedServer.specs?.addons?.map((addon, index) => (
                      <div key={`spec-addon-${index}`} className="bg-slate-950 p-3 rounded-lg border border-cyan-500/30 flex justify-between items-center">
                        <div>
                          <span className="text-white font-medium">{addon.name}</span>
                          {addon.quantity && addon.quantity > 1 && (
                            <span className="text-xs text-slate-400 ml-2">(×{addon.quantity})</span>
                          )}
                        </div>
                        <span className="text-cyan-400 font-semibold">₹{Number(addon.price || 0).toFixed(2)}</span>
                      </div>
                    ))}
                    {/* Fallback to addons array */}
                    {!selectedServer.specs?.addons && selectedServer.addons?.map((addon, index) => (
                      <div key={`addon-${index}`} className="bg-slate-950 p-3 rounded-lg border border-cyan-500/30 flex justify-between items-center">
                        <span className="text-white">{addon.name}</span>
                        <span className="text-cyan-400 font-semibold">₹{addon.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Services - Check both specs.services and services array */}
              {((selectedServer.specs?.services && selectedServer.specs.services.length > 0) || 
                (selectedServer.services && selectedServer.services.length > 0)) && (
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-cyan-400" />
                    <span>Active Services</span>
                  </h4>
                  <div className="space-y-2">
                    {/* Render from specs.services if available */}
                    {selectedServer.specs?.services?.map((service, index) => (
                      <div key={`spec-service-${index}`} className="bg-slate-950 p-3 rounded-lg border border-cyan-500/30 flex justify-between items-center">
                        <span className="text-white">{service.name}</span>
                        <span className="text-cyan-400 font-semibold">₹{Number(service.price || 0).toFixed(2)}</span>
                      </div>
                    ))}
                    {/* Fallback to services array */}
                    {!selectedServer.specs?.services && selectedServer.services?.map((service, index) => (
                      <div key={`service-${index}`} className="bg-slate-950 p-3 rounded-lg border border-cyan-500/30 flex justify-between items-center">
                        <span className="text-white">{service.name}</span>
                        <span className="text-cyan-400 font-semibold">₹{service.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-cyan-500/30">
                <Link
                  to={`/dashboard/servers/${selectedServer.id}`}
                  className="flex-1 px-4 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition font-semibold text-center border-2 border-cyan-500"
                  onClick={handleCloseDetails}
                >
                  Go to Server Management
                </Link>
                <button
                  onClick={handleCloseDetails}
                  className="px-4 py-3 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition font-semibold border border-slate-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
