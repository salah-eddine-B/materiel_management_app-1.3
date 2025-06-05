const express = require('express');
const http = require('http');
const app = express();
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require("dotenv").config();

const bodyParser = require('body-parser');

app.use(bodyParser.json());

const port = process.env.PORT || 3001;
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Constants
const DATA_FILE_PATH = path.join(__dirname, 'data', 'materielData.json');

// Read materiel data
let materielData = require('./data/materielData.json');

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

// Validation middleware
const validateMaterialInput = (req, res, next) => {
    const requiredFields = ['Material', 'Model', 'Serial_Number', 'Entry_Date', 'Unit'];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
        return res.status(400).json({
            error: 'ValidationError',
            message: 'Champs obligatoires manquants',
            details: missingFields
        });
    }
    next();
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
app.post('/materials', validateMaterialInput, (req, res) => {
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

server.listen(port, () => console.log("listening on port " + port));
