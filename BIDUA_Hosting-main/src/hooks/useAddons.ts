import { useState, useEffect } from 'react';
import api from '../lib/api';

export interface Addon {
  id: number;
  name: string;
  slug: string;
  category: string;
  description: string;
  price: number;
  billing_type: string;
  currency: string;
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
  min_quantity: number;
  max_quantity: number | null;
  default_quantity: number;
  unit_label: string | null;
  icon: string | null;
  created_at: string;
  updated_at: string | null;
}

interface UseAddonsReturn {
  addons: Addon[];
  loading: boolean;
  error: string | null;
  getAddonBySlug: (slug: string) => Addon | undefined;
  getAddonsByCategory: (category: string) => Addon[];
}

export function useAddons(): UseAddonsReturn {
  const [addons, setAddons] = useState<Addon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAddons = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('http://localhost:8000/api/v1/addons/');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch addons: ${response.statusText}`);
        }
        
        const data = await response.json();
        setAddons(data);
      } catch (err: any) {
        console.error('Error fetching addons:', err);
        setError(err.message || 'Failed to load addon pricing');
        
        // Fallback to hardcoded prices if API fails
        setAddons([
          {
            id: 1,
            name: 'Extra Storage',
            slug: 'extra-storage',
            category: 'storage',
            description: 'Additional NVMe SSD storage',
            price: 2.0,
            billing_type: 'per_unit',
            currency: 'INR',
            is_active: true,
            is_featured: false,
            sort_order: 1,
            min_quantity: 0,
            max_quantity: 1000,
            default_quantity: 0,
            unit_label: 'GB',
            icon: 'HardDrive',
            created_at: new Date().toISOString(),
            updated_at: null
          },
          {
            id: 2,
            name: 'Extra Bandwidth',
            slug: 'extra-bandwidth',
            category: 'bandwidth',
            description: 'Additional monthly bandwidth',
            price: 100.0,
            billing_type: 'per_unit',
            currency: 'INR',
            is_active: true,
            is_featured: false,
            sort_order: 2,
            min_quantity: 0,
            max_quantity: 100,
            default_quantity: 0,
            unit_label: 'TB',
            icon: 'Network',
            created_at: new Date().toISOString(),
            updated_at: null
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchAddons();
  }, []);

  const getAddonBySlug = (slug: string): Addon | undefined => {
    return addons.find(addon => addon.slug === slug);
  };

  const getAddonsByCategory = (category: string): Addon[] => {
    return addons.filter(addon => addon.category.toLowerCase() === category.toLowerCase());
  };

  return {
    addons,
    loading,
    error,
    getAddonBySlug,
    getAddonsByCategory
  };
}
