# Not deployable

The legacy security SQL here was never applied to the linked project. It was removed from the migration runner because it exposes restaurant/menu internals through public reads and accepts guest order values without authoritative server calculation. Keep it as reference only, not a launch migration.

The account foundation in `../migrations` is deliberately separate. It does not implement operational orders, stock, finance or payment processing. Its local version matches the remote migration applied through the Supabase connector.
