# Project architecture

Playground is a consumer dogfood application for Keenko. This file records only project-specific architecture beyond the generated Keenko defaults.

For KEE-4 product work, TVMaze is the external metadata authority. External payloads are decoded and normalized at the integration boundary. Playground-owned state is stored through the Keenko backend and refers to TVMaze IDs instead of cloning the external catalog.

Authentication is out of scope for KEE-4. Do not add product workspaces or domain layers during bootstrap. A later workspace or package must have distinct ownership, a stable API, and real consumers before it is introduced.
