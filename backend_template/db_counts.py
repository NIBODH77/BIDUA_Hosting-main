from sqlalchemy import create_engine, text

def main():
    engine = create_engine('postgresql+psycopg://postgres:hardik123@localhost:5432/ramaera_hosting')
    with engine.connect() as conn:
        tables = {
            'users': 'users_profiles',
            'servers': 'servers',
            'orders': 'orders',
            'invoices': 'invoices',
            'payments': 'payment_transactions',
        }
        results = {}
        for label, table in tables.items():
            try:
                count = conn.execute(text(f"SELECT COUNT(*) FROM {table}")).scalar()
            except Exception as e:
                count = f"ERROR: {e}"
            results[label] = count
        print("=== Database counts ===")
        for k, v in results.items():
            print(f"{k}: {v}")

        print("\n=== Recent users (id, email, created_at) ===")
        for row in conn.execute(text("SELECT id, email, created_at FROM users_profiles ORDER BY id DESC LIMIT 5")):
            print(row)

        print("\n=== Recent servers (id, user_id, server_name, server_status, created_at) ===")
        for row in conn.execute(text("SELECT id, user_id, server_name, server_status, created_at FROM servers ORDER BY id DESC LIMIT 5")):
            print(row)

if __name__ == '__main__':
    main()
