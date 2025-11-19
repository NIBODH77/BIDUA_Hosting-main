import { useState, useEffect } from 'react';
import { Package, Search, Edit, Trash2, Plus, ToggleLeft, ToggleRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Plan {
  id: string;
  name: string;
  description: string;
  plan_type: string;
  cpu_cores: number;
  ram_gb: number;
  storage_gb: number;
  bandwidth_gb: number;
  base_price: number;
  is_active: boolean;
  created_at: string;
}

export function PlansManagement() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isNewPlan, setIsNewPlan] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('hosting_plans')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPlans(data || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePlan = async () => {
    if (!editingPlan) return;

    try {
      if (isNewPlan) {
        const { error } = await supabase
          .from('hosting_plans')
          .insert([editingPlan]);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('hosting_plans')
          .update(editingPlan)
          .eq('id', editingPlan.id);

        if (error) throw error;
      }

      await fetchPlans();
      setShowModal(false);
      setEditingPlan(null);
      setIsNewPlan(false);
    } catch (error) {
      console.error('Error saving plan:', error);
    }
  };

  const handleDeletePlan = async (planId: string) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;

    try {
      const { error } = await supabase
        .from('hosting_plans')
        .delete()
        .eq('id', planId);

      if (error) throw error;
      await fetchPlans();
    } catch (error) {
      console.error('Error deleting plan:', error);
    }
  };

  const handleToggleActive = async (planId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('hosting_plans')
        .update({ is_active: !currentStatus })
        .eq('id', planId);

      if (error) throw error;
      await fetchPlans();
    } catch (error) {
      console.error('Error toggling plan status:', error);
    }
  };

  const handleNewPlan = () => {
    setEditingPlan({
      id: '',
      name: '',
      description: '',
      plan_type: 'shared',
      cpu_cores: 1,
      ram_gb: 1,
      storage_gb: 10,
      bandwidth_gb: 100,
      base_price: 0,
      is_active: true,
      created_at: new Date().toISOString()
    });
    setIsNewPlan(true);
    setShowModal(true);
  };

  const filteredPlans = plans.filter(plan => {
    const matchesSearch = plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || plan.plan_type === typeFilter;

    return matchesSearch && matchesType;
  });

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'shared': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'vps': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'dedicated': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'cloud': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Package className="h-7 w-7 text-cyan-400" />
            Plans Management
          </h2>
          <p className="text-slate-400">Manage hosting plans and pricing</p>
        </div>
        <button
          onClick={handleNewPlan}
          className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg hover:from-cyan-400 hover:to-teal-400 transition font-semibold flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Add Plan
        </button>
      </div>

      <div className="bg-slate-900 rounded-xl shadow-sm border-2 border-cyan-500 p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search plans..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-slate-400"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 bg-slate-800 border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 text-white"
          >
            <option value="all">All Types</option>
            <option value="shared">Shared</option>
            <option value="vps">VPS</option>
            <option value="dedicated">Dedicated</option>
            <option value="cloud">Cloud</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-cyan-500 border-r-transparent"></div>
            <p className="text-slate-400 mt-4">Loading plans...</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredPlans.map((plan) => (
              <div key={plan.id} className="bg-slate-800/50 border border-cyan-500/30 rounded-lg p-6 hover:border-cyan-500/50 transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getTypeBadgeColor(plan.plan_type)}`}>
                        {plan.plan_type.toUpperCase()}
                      </span>
                      {plan.is_active ? (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-green-500/20 text-green-400 border-green-500/30">
                          ACTIVE
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-gray-500/20 text-gray-400 border-gray-500/30">
                          INACTIVE
                        </span>
                      )}
                    </div>
                    <p className="text-slate-400 mb-4">{plan.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div>
                        <div className="text-sm text-slate-400">CPU Cores</div>
                        <div className="text-white font-semibold">{plan.cpu_cores}</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-400">RAM</div>
                        <div className="text-white font-semibold">{plan.ram_gb} GB</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-400">Storage</div>
                        <div className="text-white font-semibold">{plan.storage_gb} GB</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-400">Bandwidth</div>
                        <div className="text-white font-semibold">{plan.bandwidth_gb} GB</div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-400">Price</div>
                        <div className="text-cyan-400 font-bold text-lg">₹{plan.base_price}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleToggleActive(plan.id, plan.is_active)}
                      className={`p-2 rounded-lg transition ${plan.is_active ? 'text-green-400 hover:bg-green-500/20' : 'text-gray-400 hover:bg-gray-500/20'}`}
                      title={plan.is_active ? 'Deactivate' : 'Activate'}
                    >
                      {plan.is_active ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
                    </button>
                    <button
                      onClick={() => {
                        setEditingPlan(plan);
                        setIsNewPlan(false);
                        setShowModal(true);
                      }}
                      className="p-2 text-cyan-400 hover:bg-cyan-500/20 rounded-lg transition"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeletePlan(plan.id)}
                      className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredPlans.length === 0 && (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">No plans found</p>
              </div>
            )}
          </div>
        )}
      </div>

      {showModal && editingPlan && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-slate-900 rounded-xl border-2 border-cyan-500 p-6 max-w-2xl w-full my-8">
            <h3 className="text-xl font-bold text-white mb-4">
              {isNewPlan ? 'Add New Plan' : 'Edit Plan'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-300 mb-2">Plan Name</label>
                <input
                  type="text"
                  value={editingPlan.name}
                  onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800 border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-300 mb-2">Description</label>
                <textarea
                  value={editingPlan.description}
                  onChange={(e) => setEditingPlan({ ...editingPlan, description: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800 border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 text-white"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Plan Type</label>
                <select
                  value={editingPlan.plan_type}
                  onChange={(e) => setEditingPlan({ ...editingPlan, plan_type: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800 border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 text-white"
                >
                  <option value="shared">Shared</option>
                  <option value="vps">VPS</option>
                  <option value="dedicated">Dedicated</option>
                  <option value="cloud">Cloud</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Base Price (₹)</label>
                <input
                  type="number"
                  value={editingPlan.base_price}
                  onChange={(e) => setEditingPlan({ ...editingPlan, base_price: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 bg-slate-800 border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">CPU Cores</label>
                <input
                  type="number"
                  value={editingPlan.cpu_cores}
                  onChange={(e) => setEditingPlan({ ...editingPlan, cpu_cores: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 bg-slate-800 border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">RAM (GB)</label>
                <input
                  type="number"
                  value={editingPlan.ram_gb}
                  onChange={(e) => setEditingPlan({ ...editingPlan, ram_gb: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 bg-slate-800 border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Storage (GB)</label>
                <input
                  type="number"
                  value={editingPlan.storage_gb}
                  onChange={(e) => setEditingPlan({ ...editingPlan, storage_gb: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 bg-slate-800 border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Bandwidth (GB)</label>
                <input
                  type="number"
                  value={editingPlan.bandwidth_gb}
                  onChange={(e) => setEditingPlan({ ...editingPlan, bandwidth_gb: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 bg-slate-800 border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 text-white"
                />
              </div>

              <div className="flex items-center">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingPlan.is_active}
                    onChange={(e) => setEditingPlan({ ...editingPlan, is_active: e.target.checked })}
                    className="w-5 h-5 text-cyan-500 border-cyan-500/30 rounded focus:ring-cyan-500 bg-slate-800"
                  />
                  <span className="ml-2 text-slate-300 font-semibold">Active Plan</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSavePlan}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg hover:from-cyan-400 hover:to-teal-400 transition font-semibold"
              >
                {isNewPlan ? 'Create Plan' : 'Save Changes'}
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingPlan(null);
                  setIsNewPlan(false);
                }}
                className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
