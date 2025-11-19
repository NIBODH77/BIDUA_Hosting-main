"""
Seed addon pricing data
Run this to populate the addons table with current pricing
"""
import asyncio
from sqlalchemy import text
from app.core.database import engine


async def seed_addons():
    """Seed all addon pricing using raw SQL to avoid model dependencies"""
    
    addons_sql = """
    INSERT INTO addons (
        name, slug, category, description, price, billing_type, currency,
        is_active, is_featured, sort_order, min_quantity, max_quantity, 
        default_quantity, unit_label, icon
    ) VALUES
    -- Storage & Bandwidth
    ('Extra Storage', 'extra-storage', 'STORAGE', 'Additional NVMe SSD storage for your server', 2.00, 'PER_UNIT', 'INR', true, false, 1, 0, 1000, 0, 'GB', 'HardDrive'),
    ('Extra Bandwidth', 'extra-bandwidth', 'BANDWIDTH', 'Additional monthly bandwidth allocation', 100.00, 'PER_UNIT', 'INR', true, false, 2, 0, 100, 0, 'TB', 'Network'),
    
    -- IP Addresses
    ('Additional IPv4 Address', 'additional-ipv4', 'IP_ADDRESS', 'Additional dedicated IPv4 address', 200.00, 'PER_UNIT', 'INR', true, false, 3, 0, 10, 0, 'IP', 'Globe'),
    
    -- Plesk Control Panel
    ('Plesk Web Admin', 'plesk-admin', 'CONTROL_PANEL', 'Plesk Web Admin Edition - 10 Domains', 950.00, 'MONTHLY', 'INR', true, false, 10, 0, NULL, 0, NULL, 'Server'),
    ('Plesk Web Pro', 'plesk-pro', 'CONTROL_PANEL', 'Plesk Web Pro Edition - 30 Domains', 1750.00, 'MONTHLY', 'INR', true, false, 11, 0, NULL, 0, NULL, 'Server'),
    ('Plesk Web Host', 'plesk-host', 'CONTROL_PANEL', 'Plesk Web Host Edition - Unlimited Domains', 2650.00, 'MONTHLY', 'INR', true, false, 12, 0, NULL, 0, NULL, 'Server'),
    
    -- Backup Storage
    ('Backup Storage 100GB', 'backup-100gb', 'BACKUP', 'Cloud backup storage - 100GB', 750.00, 'MONTHLY', 'INR', true, false, 20, 0, NULL, 0, NULL, 'Database'),
    ('Backup Storage 200GB', 'backup-200gb', 'BACKUP', 'Cloud backup storage - 200GB', 1500.00, 'MONTHLY', 'INR', true, false, 21, 0, NULL, 0, NULL, 'Database'),
    ('Backup Storage 300GB', 'backup-300gb', 'BACKUP', 'Cloud backup storage - 300GB', 2250.00, 'MONTHLY', 'INR', true, false, 22, 0, NULL, 0, NULL, 'Database'),
    ('Backup Storage 500GB', 'backup-500gb', 'BACKUP', 'Cloud backup storage - 500GB', 3750.00, 'MONTHLY', 'INR', true, false, 23, 0, NULL, 0, NULL, 'Database'),
    ('Backup Storage 1000GB', 'backup-1000gb', 'BACKUP', 'Cloud backup storage - 1000GB', 7500.00, 'MONTHLY', 'INR', true, false, 24, 0, NULL, 0, NULL, 'Database'),
    
    -- SSL Certificates
    ('Essential SSL (DV)', 'ssl-essential', 'SSL', '1 Website, Domain Validation SSL Certificate', 2700.00, 'ANNUAL', 'INR', true, false, 30, 0, NULL, 0, NULL, 'Lock'),
    ('EssentialSSL Wildcard', 'ssl-essential-wildcard', 'SSL', 'Secure all subdomains with wildcard SSL', 13945.61, 'ANNUAL', 'INR', true, false, 31, 0, NULL, 0, NULL, 'Lock'),
    ('Comodo PositiveSSL', 'ssl-comodo', 'SSL', '1 Website, DV SSL from Comodo', 2500.00, 'ANNUAL', 'INR', true, false, 32, 0, NULL, 0, NULL, 'Lock'),
    ('Comodo Wildcard SSL', 'ssl-comodo-wildcard', 'SSL', 'Comodo wildcard for all subdomains', 13005.86, 'ANNUAL', 'INR', true, false, 33, 0, NULL, 0, NULL, 'Lock'),
    ('RapidSSL Certificate', 'ssl-rapid', 'SSL', '1 Website, DV SSL - Quick issuance', 3000.00, 'ANNUAL', 'INR', true, false, 34, 0, NULL, 0, NULL, 'Lock'),
    ('RapidSSL Wildcard', 'ssl-rapid-wildcard', 'SSL', 'RapidSSL wildcard for all subdomains', 16452.72, 'ANNUAL', 'INR', true, false, 35, 0, NULL, 0, NULL, 'Lock'),
    
    -- Support Packages
    ('BIDUA Hosting Support - Basic', 'support-basic', 'SUPPORT', 'Essential support with 24/7 ticket access', 2500.00, 'MONTHLY', 'INR', true, false, 40, 0, NULL, 0, NULL, 'Headphones'),
    ('BIDUA Hosting Support - Premium', 'support-premium', 'SUPPORT', 'Priority support with faster response time', 7500.00, 'MONTHLY', 'INR', true, false, 41, 0, NULL, 0, NULL, 'Headphones'),
    
    -- Managed Services
    ('Managed Server - Basic', 'managed-basic', 'MANAGEMENT', 'Basic server management and monitoring', 2000.00, 'MONTHLY', 'INR', true, false, 50, 0, NULL, 0, NULL, 'Settings'),
    ('Managed Server - Premium', 'managed-premium', 'MANAGEMENT', 'Premium server management with proactive monitoring', 5000.00, 'MONTHLY', 'INR', true, false, 51, 0, NULL, 0, NULL, 'Settings'),
    
    -- DDoS Protection
    ('DDoS Protection - Advanced', 'ddos-advanced', 'SECURITY', 'Up to 100 Gbps DDoS protection', 1000.00, 'MONTHLY', 'INR', true, false, 60, 0, NULL, 0, NULL, 'ShieldCheck'),
    ('DDoS Protection - Enterprise', 'ddos-enterprise', 'SECURITY', 'Unlimited DDoS protection with real-time mitigation', 3000.00, 'MONTHLY', 'INR', true, false, 61, 0, NULL, 0, NULL, 'ShieldCheck')
    ON CONFLICT (slug) DO NOTHING;
    """
    
    async with engine.begin() as conn:
        try:
            result = await conn.execute(text(addons_sql))
            print(f"✅ Successfully seeded {result.rowcount} addons!")
        except Exception as e:
            print(f"❌ Error seeding addons: {e}")


if __name__ == "__main__":
    print("🌱 Seeding addon pricing data...")
    asyncio.run(seed_addons())
