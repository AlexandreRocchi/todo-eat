#!/bin/sh
# Script pour attendre que la base de données soit prête

set -e

host="$1"
shift
cmd="$@"

until mysql -h "$host" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" -e 'SELECT 1'; do
  >&2 echo "MariaDB n'est pas prêt - on attend..."
  sleep 2
done

>&2 echo "MariaDB est prêt - on exécute la commande"
exec $cmd 