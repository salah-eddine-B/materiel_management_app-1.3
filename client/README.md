Root folder for the full-stack project.
material_management/
│
├── client/                     # React frontend
│   ├── public/                 # Static files
│   └── src/
│       ├── assets/            # Images, icons, etc.
│       ├── components/        # Reusable UI components
│       │   ├── Header/
│       │   ├── Sidebar/
│       │   ├── TableView/
│       │   ├── AddMaterial/
│       │   └── ...
│       ├── pages/             # Page components
│       │   ├── Dashboard.jsx
│       │   ├── Materials.jsx
│       │   └── ...
│       ├── styles/            # Global CSS/variables
│       ├── utils/             # Helper functions
│       ├── App.jsx
│       ├── index.js
│       └── config.js          # API base URLs, constants
│
├── server/                    # Node.js backend
│   ├── data/                  # JSON files used as a database
│   │   └── materials.json
│   ├── routes/                # API routes
│   │   └── materials.js
│   ├── controllers/           # Route handlers
│   │   └── materialsController.js
│   ├── middleware/            # Custom middleware (e.g., logger, error handling)
│   ├── utils/                 # Utility functions (e.g., file read/write)
│   ├── app.js                 # Express app setup
│   └── server.js              # Server entry point
│
├── package.json               # Root for dev scripts (optional)
├── README.md
└── .gitignore
