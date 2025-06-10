import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setActivePage } from '../store/uiSlice';
import '../Styles/AddMaterial.css';

const AddMaterial = ({ isOpen, onClose, onSuccess }) => {
    const dispatch = useDispatch();
    const [materialOptions] = useState([
        'RADAR', 
        'RADAR-MARITIME', 
        'CAMERA', 
        'VIDEO PROJECTEUR', 
        'DVR', 
        'NVR', 
        'TV', 
        'OTHER'
    ]);
    const [modelOptions, setModelOptions] = useState([]);
    const [errors, setErrors] = useState({});
    const [showNewModelInput, setShowNewModelInput] = useState(false);
    const [newModel, setNewModel] = useState('');
    const [nextId, setNextId] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [formData, setFormData] = useState({
        Id: '',
        Unit: '',
        Entry_Date: new Date().toISOString().substr(0, 10),
        Material: '',
        Model: '',
        Serial_Number: '',
        Delivery_Note_Number: '',
        Shuttle_Record_Number: '',
        Status: 'EN COURS',
        Exit_Date: '##/##/####',
        Aditional_Data: ''
    });

    // Clear success message after 2 seconds
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage('');
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const resetForm = async () => {
        try {
            const response = await fetch('http://localhost:3001/materials');
            const materials = await response.json();
            const currentYear = new Date().getFullYear().toString().slice(-2);
            const lastId = materials.length > 0 ? materials[materials.length - 1].Id : null;
            const nextNumber = lastId 
                ? (parseInt(lastId.split('-')[0]) + 1).toString().padStart(4, '0')
                : '0001';
            const newId = `${nextNumber}-${currentYear}`;
            
            setFormData({
                Id: newId,
                Unit: '',
                Entry_Date: new Date().toISOString().substr(0, 10),
                Material: '',
                Model: '',
                Serial_Number: '',
                Delivery_Note_Number: '',
                Shuttle_Record_Number: '',
                Status: 'EN COURS',
                Exit_Date: '##/##/####',
                Aditional_Data: ''
            });
            setShowNewModelInput(false);
            setNewModel('');
            setErrors({});
        } catch (error) {
            console.error('Error fetching next ID:', error);
        }
    };

    // Fetch next ID when component mounts or when modal is opened
    useEffect(() => {
        if (isOpen) {
            resetForm();
        }
    }, [isOpen]);

    // Fetch models when material changes
    useEffect(() => {
        if (formData.Material) {
            fetch(`http://localhost:3001/model?model=${formData.Material}`)
                .then(response => response.json())
                .then(data => {
                    if (Array.isArray(data)) {
                        setModelOptions(data);
                    } else {
                        setModelOptions([]);
                    }
                })
                .catch(error => {
                    console.error('Error fetching models:', error);
                    setModelOptions([]);
                });
        }
    }, [formData.Material]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Reset model when material changes
        if (name === 'Material') {
            setFormData(prev => ({ ...prev, Model: '' }));
            setShowNewModelInput(false);
            setNewModel('');
        }
    };

    const handleModelChange = (e) => {
        const value = e.target.value;
        if (value === 'new') {
            setShowNewModelInput(true);
            setFormData(prev => ({ ...prev, Model: '' }));
        } else {
            setShowNewModelInput(false);
            setFormData(prev => ({ ...prev, Model: value }));
        }
    };

    const handleAddNewModel = async () => {
        if (!newModel.trim()) {
            setErrors(prev => ({ ...prev, newModel: 'Le modèle ne peut pas être vide' }));
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/model', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    material: formData.Material,
                    model: newModel
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setModelOptions(data.modelData);
                setFormData(prev => ({ ...prev, Model: newModel }));
                setShowNewModelInput(false);
                setNewModel('');
                setErrors(prev => ({ ...prev, newModel: null }));
            } else {
                setErrors(prev => ({ ...prev, newModel: data.message }));
            }
        } catch (error) {
            console.error('Error adding new model:', error);
            setErrors(prev => ({ ...prev, newModel: 'Erreur lors de l\'ajout du modèle' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        const materialData = {
            ...formData,
            Status: 'EN COURS',
            Exit_Date: '##/##/####',
            Aditional_Data: ''
        };

        try {
            const response = await fetch('http://localhost:3001/materials', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(materialData),
            });

            const data = await response.json();

            if (data.error === 'Duplicate') {
                const errorMessage = (
                    <div>
                        <p>{data.message}</p>
                        <p>Détails du matériel existant:</p>
                        <ul>
                            <li>Matériel: {data.details.material}</li>
                            <li>Modèle: {data.details.model}</li>
                            <li>Numéro de série: {data.details.serialNumber}</li>
                            <li>Date d'entrée: {data.details.entryDate}</li>
                        </ul>
                        <p>Vous pouvez modifier les informations ci-dessous et réessayer.</p>
                    </div>
                );
                setErrors({ duplicate: errorMessage });
                const form = document.querySelector('.add-material-form');
                if (form) {
                    form.scrollTop = 0;
                }
            } else if (data.error) {
                setErrors({ submit: data.message || 'Une erreur est survenue' });
            } else {
                // Set success message and notify parent
                setSuccessMessage('Matériel ajouté avec succès');
                onSuccess(data.message || 'Matériel ajouté avec succès');
                await resetForm();
            }
        } catch (error) {
            console.error('Error:', error);
            setErrors({ submit: 'Erreur lors de l\'ajout du matériel' });
        }
    };

    const renderError = (field) => {
        if (errors[field]) {
            return <span className="error-message">{errors[field]}</span>;
        }
        return null;
    };

    useEffect(() => {
        const handleEscapeKey = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscapeKey);
        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div className="add-material-container">
            <div className="add-material-form">
                <button className="close-button" onClick={onClose}>×</button>
                <h2>
                    {successMessage ? (
                        <span className="success-title">{successMessage}</span>
                    ) : (
                        'Ajouter Nouveau Matériel'
                    )}
                </h2>
                
                <form onSubmit={handleSubmit}>
                    {errors.duplicate && (
                        <div className="error-container">
                            {errors.duplicate}
                        </div>
                    )}
                    {errors.submit && (
                        <div className="error-container">
                            <p>{errors.submit}</p>
                        </div>
                    )}

                    <div className="form-grid">
                        <div className="form-column">
                            <div className="form-group">
                                <label>ID:</label>
                                <input
                                    type="text"
                                    name="Id"
                                    value={formData.Id}
                                    disabled
                                    className="disabled-input"
                                />
                            </div>

                            <div className="form-group">
                                <label>Unité:</label>
                                <input
                                    type="text"
                                    name="Unit"
                                    value={formData.Unit}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Date d'entrée:</label>
                                <input
                                    type="date"
                                    name="Entry_Date"
                                    value={formData.Entry_Date}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Matériel:</label>
                                <select
                                    name="Material"
                                    value={formData.Material}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Sélectionner un matériel</option>
                                    {materialOptions.map((option, index) => (
                                        <option key={index} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Modèle:</label>
                                <select
                                    name="Model"
                                    value={formData.Model}
                                    onChange={handleModelChange}
                                    required={!showNewModelInput}
                                    disabled={!formData.Material}
                                >
                                    <option value="">Sélectionner un modèle</option>
                                    {modelOptions.map((option, index) => (
                                        <option key={index} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                    <option value="new">+ Ajouter un nouveau modèle</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-column">
                            <div className="form-group">
                                <label>Status:</label>
                                <input
                                    type="text"
                                    name="Status"
                                    value="EN COURS"
                                    disabled
                                    className="disabled-input"
                                />
                            </div>

                            <div className="form-group">
                                <label>Numéro de série:</label>
                                <input
                                    type="text"
                                    name="Serial_Number"
                                    value={formData.Serial_Number}
                                    onChange={handleInputChange}
                                    className={errors.Serial_Number ? 'error' : ''}
                                    required
                                />
                                {renderError('Serial_Number')}
                            </div>

                            <div className="form-group">
                                <label>Numéro de BL:</label>
                                <input
                                    type="text"
                                    name="Delivery_Note_Number"
                                    value={formData.Delivery_Note_Number}
                                    onChange={handleInputChange}
                                    className={errors.Delivery_Note_Number ? 'error' : ''}
                                    required
                                />
                                {renderError('Delivery_Note_Number')}
                            </div>

                            <div className="form-group">
                                <label>Numéro de F/N:</label>
                                <input
                                    type="text"
                                    name="Shuttle_Record_Number"
                                    value={formData.Shuttle_Record_Number}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Date de sortie:</label>
                                <input
                                    type="text"
                                    name="Exit_Date"
                                    value={formData.Exit_Date}
                                    disabled
                                    className="disabled-input"
                                />
                            </div>
                        </div>
                    </div>

                    {showNewModelInput && (
                        <div className="form-group new-model-input">
                            <label>Nouveau Modèle:</label>
                            <div className="new-model-container">
                                <input
                                    type="text"
                                    value={newModel}
                                    onChange={(e) => setNewModel(e.target.value)}
                                    placeholder="Entrer le nouveau modèle"
                                />
                                <button 
                                    type="button" 
                                    onClick={handleAddNewModel}
                                    className="add-model-btn"
                                >
                                    Ajouter
                                </button>
                            </div>
                            {errors.newModel && (
                                <span className="error-message">{errors.newModel}</span>
                            )}
                        </div>
                    )}

                    <div className="form-buttons">
                        <button type="submit">Enregistrer</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddMaterial; 