const express = require('express');
const http = require('http');
const app = express();
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require("dotenv").config();

const bodyParser = require('body-parser');

const { spawn } = require('child_process');


app.use(bodyParser.json());

const port = process.env.PORT || 3001;
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Constants
const DATA_FILE_PATH = path.join(__dirname, 'data', 'materielData.json');
const MODEL_FILE_PATH = path.join(__dirname, 'data', 'MaterialModel.json');

// Read materiel data
let materielData = require('./data/materielData.json');

// Read exportation data
let exportationData = require('./data/Export_log.json');

// Read or initialize model data
let modelData = {};
try {
    modelData = require('./data/MaterialModel.json');
} catch (error) {
    // If file doesn't exist, initialize with default categories
    modelData = {
        'RADAR': [],
        'RADAR-MARITIME': [],
        'CAMERA': [],
        'VIDEO PROJECTEUR': [],
        'DVR-NVR': [],
        'TV': [],
        'OTHER': []
    };
    // Create the file with initial data
    fs.writeFileSync(MODEL_FILE_PATH, JSON.stringify(modelData, null, 2));
}

// Helper function to generate next ID
const generateNextId = () => {
    // Get current year's last two digits
    const currentYear = new Date().getFullYear().toString().slice(-2);
    
    try {
        // If there are no items, start with 0001-YY
        if (materielData.length === 0) {
            return `0001-${currentYear}`;
        }

        // Get the last item's ID
        const lastId = materielData[materielData.length - 1].Id;
        
        // Extract the numeric part (before the hyphen)
        const lastNumber = parseInt(lastId.split('-')[0].replace(/\D/g, '')) || 0;
        
        // Generate new number with leading zeros
        const nextNumber = (lastNumber + 1).toString().padStart(4, '0');
        
        return `${nextNumber}-${currentYear}`;
    } catch (error) {
        console.error('Error generating ID:', error);
        // Fallback: Get the highest number from all IDs
        const highestNumber = materielData.reduce((max, item) => {
            const num = parseInt(item.Id.split('-')[0].replace(/\D/g, '')) || 0;
            return Math.max(max, num);
        }, 0);
        
        const nextNumber = (highestNumber + 1).toString().padStart(4, '0');
        return `${nextNumber}-${currentYear}`;
    }
};

// GET endpoint
app.get("/materials", (req, res) => {
    try {
        res.json(materielData);
    } catch (error) {
        console.error('Error fetching materials:', error);
        res.status(500).json({ 
            error: 'ServerError', 
            message: 'Erreur lors de la récupération des matériels' 
        });
    }
});

// POST endpoint
app.post('/materials', (req, res) => {
    try {
        const newItem = req.body;

        // Check for existing item with same Material, Model, and Serial Number
        const existingItem = materielData.find(item => 
            item.Material.toLowerCase() === newItem.Material.toLowerCase() &&
            item.Model.toLowerCase() === newItem.Model.toLowerCase() &&
            item.Serial_Number.toLowerCase() === newItem.Serial_Number.toLowerCase()
        );

        if (existingItem) {
            // If found an existing item, check if the Entry_Date is different
            if (existingItem.Entry_Date === newItem.Entry_Date) {
                return res.status(400).json({ 
                    error: 'Duplicate',
                    message: 'Ce matériel existe déjà avec la même date d\'entrée',
                    details: {
                        material: newItem.Material,
                        model: newItem.Model,
                        serialNumber: newItem.Serial_Number,
                        entryDate: newItem.Entry_Date
                    }
                });
            }
        }

        // Generate new ID with the specified format
        newItem.Id = generateNextId();

        // Set default values for optional fields
        newItem.Status = newItem.Status || 'NON REPARE';
        newItem.Exit_Date = newItem.Exit_Date || '##/##/####';
        newItem.Aditional_Data = newItem.Aditional_Data || '';

        // Add the new item to the array
        materielData.push(newItem);

        // Write to file
        fs.writeFile(DATA_FILE_PATH, JSON.stringify(materielData, null, 2), (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return res.status(500).json({ 
                    error: 'ServerError', 
                    message: 'Erreur lors de l\'enregistrement' 
                });
            }

            res.status(201).json({ 
                message: existingItem 
                    ? 'Matériel ajouté avec une nouvelle date d\'entrée'
                    : 'Matériel ajouté avec succès',
                item: newItem 
            });
        });
    } catch (error) {
        console.error('Error processing material addition:', error);
        res.status(500).json({ 
            error: 'ServerError', 
            message: 'Erreur lors du traitement de l\'ajout du matériel' 
        });
    }
});

// GET endpoint for models
app.get("/model", (req, res) => {
    const material = req.query.model; // Get the material from query parameters
    
    if (!material) {
        return res.status(400).json({ 
            error: "ValidationError", 
            message: "Le paramètre 'model' est requis" 
        });
    }

    const models = modelData[material.toUpperCase()];
    if (models) {
        res.json(models);
    } else {
        res.status(404).json({ 
            error: "NotFound", 
            message: "Aucun modèle trouvé pour ce matériel" 
        });
    }
});

// PUT endpoint to add a new model
app.put("/model", (req, res) => {
    const { material, model } = req.body;

    if (!material || !model) {
        return res.status(400).json({ 
            error: "ValidationError", 
            message: "Le matériel et le modèle sont requis" 
        });
    }

    const upperMaterial = material.toUpperCase();
    
    if (!modelData[upperMaterial]) {
        return res.status(404).json({ 
            error: "NotFound", 
            message: "Type de matériel non trouvé" 
        });
    }

    // Check if model already exists
    if (modelData[upperMaterial].includes(model)) {
        return res.status(400).json({
            error: "Duplicate",
            message: "Ce modèle existe déjà pour ce type de matériel"
        });
    }

    try {
        // Add new model
        modelData[upperMaterial].push(model);

        // Write updated data to file
        fs.writeFileSync(MODEL_FILE_PATH, JSON.stringify(modelData, null, 2));

        res.json({ 
            message: "Modèle ajouté avec succès", 
            modelData: modelData[upperMaterial] 
        });
    } catch (error) {
        console.error('Error updating model data:', error);
        res.status(500).json({ 
            error: "ServerError", 
            message: "Erreur lors de l'ajout du modèle" 
        });
    }
});

// PUT endpoint to update a material
app.put('/materials/:id', (req, res) => {
    try {
        const materialId = req.params.id;
        const updatedData = req.body;

        // Find the index of the material to update
        const materialIndex = materielData.findIndex(item => item.Id === materialId);

        if (materialIndex === -1) {
            return res.status(404).json({
                error: 'NotFound',
                message: 'Matériel non trouvé'
            });
        }

        // Preserve the original ID
        updatedData.Id = materialId;

        // Update the material in the array
        materielData[materialIndex] = updatedData;

        // Write to file
        fs.writeFile(DATA_FILE_PATH, JSON.stringify(materielData, null, 2), (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return res.status(500).json({
                    error: 'ServerError',
                    message: 'Erreur lors de la mise à jour'
                });
            }

            res.json({
                message: 'Matériel mis à jour avec succès',
                item: updatedData
            });
        });
    } catch (error) {
        console.error('Error updating material:', error);
        res.status(500).json({
            error: 'ServerError',
            message: 'Erreur lors de la mise à jour du matériel'
        });
    }
});

// GET endpoint for category counts
app.get("/materials/counts", (req, res) => {
    try {
        // Define main categories
        const mainCategories = ['RADAR', 'RADAR-MARITIME', 'CAMERA', 'VIDEO PROJECTEUR', 'DVR', 'NVR', 'TV'];
        
        // Initialize counts object
        const counts = {
            'TOUT': materielData.length,
            'RADAR': 0,
            'RADAR-MARITIME': 0,
            'CAMERA': 0,
            'VIDEO PROJECTEUR': 0,
            'DVR-NVR': 0,
            'TV': 0,
            'OTHER': 0
        };

        // Count materials for each category
        materielData.forEach(material => {
            const materialType = material.Material?.toUpperCase();
            
            if (mainCategories.includes(materialType)) {
                if (materialType === 'DVR' || materialType === 'NVR') {
                    counts['DVR-NVR']++;
                } else {
                    counts[materialType]++;
                }
            } else {
                counts['OTHER']++;
            }
        });

        res.json(counts);
    } catch (error) {
        console.error('Error counting materials:', error);
        res.status(500).json({ 
            error: 'ServerError', 
            message: 'Erreur lors du comptage des matériels' 
        });
    }
});

// GET endpoint for status counts
app.get("/materials/status-counts", (req, res) => {
    try {
        const statusLabels = {
            'REPARE': 'Repaired',
            'EN COURS': 'In Progress',
            'NON REPARE': 'Not Repaired',
            'REFORME': 'Reformed'
        };
        const counts = {
            'Repaired': 0,
            'In Progress': 0,
            'Not Repaired': 0,
            'Reformed': 0
        };
        materielData.forEach(material => {
            const status = statusLabels[material.Status?.toUpperCase()];
            if (status) {
                counts[status]++;
            }
        });
        res.json(counts);
    } catch (error) {
        console.error('Error counting status:', error);
        res.status(500).json({
            error: 'ServerError',
            message: 'Erreur lors du comptage des statuts'
        });
    }
});

//Read assigned persons data
let assignedPersons = require('./data/assignedPersons.json');



// Exportaion part
// GET endpoint for assigned persons
app.get("/assignedPersons", (req, res) => {
    res.json(assignedPersons);
});


// GET endpoint to get exportation count
app.get("/exportation/count", (req, res) => {
    try {
        const count = exportationData.length;
        res.json({ count });
    } catch (error) {
        console.error('Error getting count:', error);
        res.status(500).json({ error: 'Failed to get count' });
    }
});

// POST endpoint to add a new exportation
app.post("/exportation/Panne", (req, res) => {
    const newExport = req.body;
    console.log("Received new export:", newExport);

    // Pass the data directly to Python script as JSON string
    // const pythonProcess = spawn('python', [
    //     path.join(__dirname, '../../Scripts/PanneWord.py'), 
    //     JSON.stringify(newExport)
    // ]);

    const pythonProcess = spawn('python', [
        path.join(__dirname, '/scripts/breackdownsheetGenerator.py'), 
        JSON.stringify(newExport)
    ]);

    let pythonData = '';

    pythonProcess.stdout.on('data', (data) => {
        pythonData += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Python Error: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        if (code === 0) {
            try {
                const result = JSON.parse(pythonData);
                if (result.success) {
                    exportationData.push(newExport);
                    console.log(`✅ Data successfully added to exportation.json: ${newExport.fileName}`);
                    
                    // Send both the file and success message
                    res.setHeader('Content-Disposition', `attachment; filename="${newExport.fileName}.docx"`);
                    res.sendFile(result.filepath, (err) => {
                        if (err) {
                            console.error('Error sending file:', err);
                            res.status(500).json({ 
                                success: false, 
                                message: "Error sending file" 
                            });
                    
                        }
                    });
                    fs.writeFile(path.join(__dirname, 'data', 'Export_log.json'), JSON.stringify(exportationData, null, 2), (err) => {
                        if (err) {
                            console.error('Error writing file:', err);
                            res.status(500).json({ 
                                success: false, 
                                message: "Error writing file" 
                            });
                        }
                    });
                } else {
                    res.status(500).json({ 
                        success: false, 
                        message: result.message 
                    });
                }
            } catch (error) {
                console.error('Error parsing Python output:', error);
                res.status(500).json({ 
                    success: false, 
                    message: "Error processing Python output" 
                });
            }
        } else {
            res.status(500).json({ 
                success: false, 
                message: "Failed to create document" 
            });
        }
    });
});


server.listen(port, () => console.log("listening on port " + port));
