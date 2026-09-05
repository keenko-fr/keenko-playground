# Project architecture

Playground uses the generated Keenko workspace and boundary model without a local convention fork.

For KEE-4 product work, TVMaze owns external TV metadata. Decode provider payloads at the integration boundary and normalize them before they cross application boundaries. Convex initially owns only Playground state such as watchlist or curation state plus TVMaze identifiers. Do not persist complete TVMaze show records in the first slice.

Authentication is outside KEE-4. Do not add another workspace during bootstrap. Later work may add one only for a real ownership or reuse boundary and must use the Keenko Nx tags and dependency rules.
