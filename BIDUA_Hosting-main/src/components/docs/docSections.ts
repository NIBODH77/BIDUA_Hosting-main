import { LucideIcon, Home, Layers, Code, Zap, Users, Shield, Rocket, Settings } from 'lucide-react';

export interface DocSection {
  title: string;
  icon: LucideIcon;
  items?: {
    title: string;
    path: string;
  }[];
}

export const docSections: DocSection[] = [
  {
    title: 'Getting Started',
    icon: Home,
    items: [
      { title: 'Introduction', path: '/docs/introduction' },
      { title: 'Quick Start', path: '/docs/quick-start' },
      { title: 'Installation', path: '/docs/installation' },
    ]
  },
  {
    title: 'Architecture',
    icon: Layers,
    items: [
      { title: 'Overview', path: '/docs/architecture' },
      { title: 'Backend Structure', path: '/docs/backend' },
      { title: 'Frontend Structure', path: '/docs/frontend' },
      { title: 'Database Schema', path: '/docs/database' },
    ]
  },
  {
    title: 'API Reference',
    icon: Code,
    items: [
      { title: 'Authentication', path: '/docs/api/auth' },
      { title: 'Plans & Pricing', path: '/docs/api/plans' },
      { title: 'Orders', path: '/docs/api/orders' },
      { title: 'Payments', path: '/docs/api/payments' },
      { title: 'Servers', path: '/docs/api/servers' },
      { title: 'Support', path: '/docs/api/support' },
      { title: 'Referrals', path: '/docs/api/referrals' },
    ]
  },
  {
    title: 'Features',
    icon: Zap,
    items: [
      { title: 'Hosting Plans', path: '/docs/features/hosting' },
      { title: 'Add-ons System', path: '/docs/features/addons' },
      { title: 'Billing & Invoicing', path: '/docs/features/billing' },
      { title: 'Payment Gateway', path: '/docs/features/payments' },
      { title: 'Support Tickets', path: '/docs/features/support' },
      { title: 'Referral Program', path: '/docs/features/referrals' },
    ]
  },
  {
    title: 'User Guides',
    icon: Users,
    items: [
      { title: 'Account Setup', path: '/docs/user/account' },
      { title: 'Purchasing Servers', path: '/docs/user/purchase' },
      { title: 'Managing Servers', path: '/docs/user/servers' },
      { title: 'Billing & Payments', path: '/docs/user/billing' },
      { title: 'Support System', path: '/docs/user/support' },
      { title: 'Referral Earnings', path: '/docs/user/referrals' },
    ]
  },
  {
    title: 'Admin Guides',
    icon: Shield,
    items: [
      { title: 'Admin Dashboard', path: '/docs/admin/dashboard' },
      { title: 'User Management', path: '/docs/admin/users' },
      { title: 'Plan Management', path: '/docs/admin/plans' },
      { title: 'Order Management', path: '/docs/admin/orders' },
      { title: 'Support Management', path: '/docs/admin/support' },
    ]
  },
  {
    title: 'Deployment',
    icon: Rocket,
    items: [
      { title: 'Environment Setup', path: '/docs/deploy/environment' },
      { title: 'Backend Deployment', path: '/docs/deploy/backend' },
      { title: 'Frontend Deployment', path: '/docs/deploy/frontend' },
      { title: 'Database Setup', path: '/docs/deploy/database' },
    ]
  },
  {
    title: 'Configuration',
    icon: Settings,
    items: [
      { title: 'Environment Variables', path: '/docs/config/env' },
      { title: 'Payment Gateway', path: '/docs/config/payment' },
      { title: 'Email Setup', path: '/docs/config/email' },
    ]
  },
];
