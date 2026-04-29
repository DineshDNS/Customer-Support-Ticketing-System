import time
import psycopg2

while True:
    try:
        conn = psycopg2.connect(
            dbname="ticketing_db",
            user="postgres",
            password="667254",
            host="postgres",
            port="5432"
        )
        conn.close()
        print("✅ Database is ready!")
        break
    except psycopg2.OperationalError as e:
        print("⏳ Waiting for database...", e)
        time.sleep(2)