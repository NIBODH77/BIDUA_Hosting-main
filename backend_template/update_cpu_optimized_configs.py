import asyncio
import asyncpg

async def update_cpu_optimized_configurations():
    """
    Update CPU Optimized plans to have more vCPUs for compute-intensive workloads.
    CPU Optimized should have approximately 1:1 to 1.5:1 RAM:CPU ratio.
    """
    conn = await asyncpg.connect(
        host='localhost',
        port=5432,
        user='postgres',
        password='hardik123',
        database='ramaera_hosting'
    )
    
    # New CPU configurations for CPU Optimized plans
    # Format: (plan_name, new_cpu_cores)
    cpu_updates = [
        ('C.4GB', 4),      # Was 2, now 4 (1:1 ratio)
        ('C.8GB', 8),      # Was 4, now 8 (1:1 ratio)
        ('C.16GB', 12),    # Was 6, now 12 (1.3:1 ratio)
        ('C.32GB', 16),    # Was 8, now 16 (2:1 ratio)
        ('C.48GB', 20),    # Was 10, now 20 (2.4:1 ratio)
        ('C.64GB', 24),    # Was 12, now 24 (2.7:1 ratio)
        ('C.96GB', 32),    # Was 16, now 32 (3:1 ratio)
        ('C.128GB', 36),   # Was 16, now 36 (3.6:1 ratio)
        ('C.256GB', 48),   # Was 24, now 48 (5.3:1 ratio)
    ]
    
    print('=' * 80)
    print('UPDATING CPU OPTIMIZED CONFIGURATIONS')
    print('=' * 80)
    
    for plan_name, new_cpu_cores in cpu_updates:
        # Get current configuration
        current = await conn.fetchrow(
            'SELECT cpu_cores, ram_gb FROM hosting_plans WHERE name = $1',
            plan_name
        )
        
        old_cpu = current['cpu_cores']
        ram = current['ram_gb']
        old_ratio = ram / old_cpu
        new_ratio = ram / new_cpu_cores
        
        # Update the CPU cores
        await conn.execute(
            'UPDATE hosting_plans SET cpu_cores = $1 WHERE name = $2',
            new_cpu_cores, plan_name
        )
        
        print(f'\n✅ {plan_name} ({ram}GB RAM):')
        print(f'   Old: {old_cpu} vCPU (ratio {old_ratio:.1f}:1)')
        print(f'   New: {new_cpu_cores} vCPU (ratio {new_ratio:.1f}:1)')
    
    print('\n' + '=' * 80)
    print('VERIFICATION - Updated CPU Optimized Plans:')
    print('=' * 80)
    
    updated_plans = await conn.fetch('''
        SELECT name, ram_gb, cpu_cores, storage_gb, bandwidth_gb
        FROM hosting_plans
        WHERE plan_type = 'cpu_optimized'
        ORDER BY ram_gb
    ''')
    
    print(f'\n{"Plan":<12} {"RAM":<10} {"vCPU":<8} {"Ratio":<12} {"Storage":<12} {"Bandwidth"}')
    print('-' * 80)
    
    for plan in updated_plans:
        ratio = plan['ram_gb'] / plan['cpu_cores']
        print(f'{plan["name"]:<12} {plan["ram_gb"]}GB{"":<6} {plan["cpu_cores"]:<8} {ratio:.1f}:1{"":<8} {plan["storage_gb"]}GB{"":<6} {plan["bandwidth_gb"]/1000}TB')
    
    print('\n' + '=' * 80)
    print('COMPARISON ACROSS ALL TYPES:')
    print('=' * 80)
    
    all_plans = await conn.fetch('''
        SELECT name, plan_type, ram_gb, cpu_cores
        FROM hosting_plans
        WHERE ram_gb IN (4, 8, 16, 32, 64, 128, 256)
        ORDER BY ram_gb, 
            CASE plan_type 
                WHEN 'general_purpose' THEN 1 
                WHEN 'cpu_optimized' THEN 2 
                WHEN 'memory_optimized' THEN 3 
            END
    ''')
    
    current_ram = None
    for plan in all_plans:
        if plan['ram_gb'] != current_ram:
            current_ram = plan['ram_gb']
            print(f'\n{current_ram}GB RAM:')
        
        ratio = plan['ram_gb'] / plan['cpu_cores']
        type_short = {
            'general_purpose': 'GP',
            'cpu_optimized': 'CPU',
            'memory_optimized': 'MEM'
        }[plan['plan_type']]
        
        print(f'  {type_short:<4} {plan["name"]:<10} → {plan["cpu_cores"]:>2} vCPU (ratio {ratio:.1f}:1)')
    
    print('\n✅ All CPU Optimized configurations updated successfully!')
    
    await conn.close()

if __name__ == '__main__':
    asyncio.run(update_cpu_optimized_configurations())
