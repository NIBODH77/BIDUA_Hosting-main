from sqlalchemy import create_engine, text

# WARNING: This deletes all servers and billing data (orders, invoices, payments, related tables)
# Users remain intact.

DSN = 'postgresql+psycopg://postgres:hardik123@localhost:5432/ramaera_hosting'

TABLES_IN_DELETE_ORDER = [
    # Children first
    'referral_earnings',
    'order_addons',
    'order_services',
    'invoices',
    'payment_transactions',
    # Parents
    'orders',
    'servers',
]

def count(conn, table):
    try:
        return conn.execute(text(f"SELECT COUNT(*) FROM {table}")).scalar()
    except Exception as e:
        return f"ERROR: {e}"


def main():
    engine = create_engine(DSN)
    with engine.begin() as conn:
        print("=== Before cleanup ===")
        for t in ['users_profiles','servers','orders','invoices','payment_transactions','order_addons','order_services','referral_earnings']:
            print(f"{t}: {count(conn, t)}")

        # Disable triggers if necessary (postgres specific) - not required usually
        # Perform deletes in order
        for table in TABLES_IN_DELETE_ORDER:
            try:
                deleted = conn.execute(text(f"DELETE FROM {table}"))
                print(f"Deleted from {table}: {deleted.rowcount}")
            except Exception as e:
                print(f"Failed to delete {table}: {e}")

        print("\n=== After cleanup ===")
        for t in ['users_profiles','servers','orders','invoices','payment_transactions','order_addons','order_services','referral_earnings']:
            print(f"{t}: {count(conn, t)}")

if __name__ == '__main__':
    main()
