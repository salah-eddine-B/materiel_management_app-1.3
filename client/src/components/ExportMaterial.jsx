import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import '../Styles/ExportMaterial.css';

const PersonCard = ({ person, index, moveCard, handleRemovePerson }) => {
    const [{ isDragging }, drag] = useDrag({
        type: 'person',
        item: { index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [{ isOver }, drop] = useDrop({
        accept: 'person',
        hover: (item, monitor) => {
            if (!monitor.canDrop()) return;
            
            const dragIndex = item.index;
            const hoverIndex = index;

            if (dragIndex === hoverIndex) return;

            moveCard(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    });

    return (
        <div
            ref={(node) => drag(drop(node))}
            className={`selected-person-card ${isDragging ? 'dragging' : ''} ${isOver ? 'drop-target' : ''}`}
            style={{ opacity: isDragging ? 0.4 : 1 }}
        >
            <div className="drag-handle">⋮⋮</div>
            <button
                type="button"
                className="remove-person-btn"
                onClick={() => handleRemovePerson(person.name)}
                title="Supprimer cette personne"
            >
                ×
            </button>
            <div className="person-info">
                <span className="person-name">{person.name}</span>
                <span className="person-role">{person.role}</span>
            </div>
        </div>
    );
};

const ExportMaterial = ({ isOpen, onClose, materialData }) => {
    const defaultGlobalStatus = "Le matériel présente des signes de dysfonctionnement nécessitant une intervention technique. L'analyse préliminaire révèle des anomalies qui affectent ses performances optimales. Une évaluation approfondie est nécessaire pour déterminer l'étendue exacte des problèmes et établir un plan d'action approprié.";
    // console.log('this is the selected material Data',JSON.stringify(materialData));

    const [selectedPersons, setSelectedPersons] = useState([]);
    const [availablePersons, setAvailablePersons] = useState([]);
    const [formData, setFormData] = useState({
        fileName: '',
        exportId:'',
        Material_Data: [
            {
                unit: '',
                entryDate: '',
                material: '',
                model: '',
                serialNumber: '',
                situation: '',
                attributionDate: '',
                technicians: [],
                globalStatus: defaultGlobalStatus,
                technicalDiagnostic: '',
                actionTaken: '',
                proposedActions: '',
                isCustomGlobalStatus: false
            }
        ]
        ,assignedPersons: []
    })
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState({ type: '', text: '' });
    const [showNewTechnicianInput, setShowNewTechnicianInput] = useState(false);
    const [newTechnician, setNewTechnician] = useState('');
    const [technicians, setTechnicians] = useState([
        'John Doe',
        'Jane Smith',
        'Mike Johnson',
        'Sarah Williams'
    ]);
    const [isCustomGlobalStatus, setIsCustomGlobalStatus] = useState(false);

    useEffect(() => {
        const fetchAssignedPersons = async () => {
            try {
                const response = await fetch('http://localhost:3001/assignedPersons');
                const data = await response.json();
                setAvailablePersons(data.assignedPersons);
               
            } catch (error) {
                console.error('Error fetching assigned persons:', error);
                setMessage({ type: 'error', text: 'Erreur lors de la récupération des assignations' });
            }
        };

        fetchAssignedPersons();
    }, []);

    useEffect(() => {
        if (!isOpen) return; // Only run when modal is open

        if (materialData) {
            const fetchExportCount = async () => {
                try {
                    const response = await fetch('http://localhost:3001/exportation/count');
                    const data = await response.json();
                    const newId = `${data.count + 1}-Exp`;

                    setFormData({
                        fileName: `FICHE PANNE ${materialData.Material || ''} ${materialData.Unit || ''} ${newId}`,
                        exportId: newId,
                        Material_Data: [
                            {
                                unit: materialData.Unit || '',
                                entryDate: materialData.Entry_Date || '',
                                material: materialData.Material || '',
                                model: materialData.Model || '',
                                serialNumber: materialData.Serial_Number || '',
                                situation: materialData.Status || '',
                                attributionDate:materialData.Entry_Date || '',
                                technicians: [],
                                globalStatus: defaultGlobalStatus,
                                technicalDiagnostic: '',
                                actionTaken: '',
                                proposedActions: '',
                                isCustomGlobalStatus: false
                            }
                        ],
                        assignedPersons: []
                    });

                    setSelectedPersons([]);

                } catch (error) {
                    console.error('Error fetching export count:', error);
                    setMessage({ type: 'error', text: 'Erreur lors de la génération de l\'ID' });
                }
            };

            fetchExportCount();
        } else {
            // Instead of showing an error, close the modal or show a friendly message
            setMessage({ type: 'error', text: 'Veuillez sélectionner un matériel à exporter.' });
            // Optionally, auto-close the modal after a short delay:
            setTimeout(() => {
                onClose();
            }, 1500);
        }
    }, [materialData, isOpen]);

    const handlePersonChange = (value) => {
        if (value && selectedPersons.length < 4) {
            const person = availablePersons.find(p => p.name === value);
            if (person && !selectedPersons.some(p => p.name === person.name)) {
                setSelectedPersons(prev => [...prev, person]);
                setFormData(prev => ({
                    ...prev,
                    assignedPersons: [...prev.assignedPersons, person]
                }));
            }
        }
    };

    const handleRemovePerson = (personName) => {
        setSelectedPersons(prev => prev.filter(p => p.name !== personName));
        setFormData(prev => ({
            ...prev,
            assignedPersons: prev.assignedPersons.filter(p => p.name !== personName)
        }));
    };

    const moveCard = (dragIndex, hoverIndex) => {
        setSelectedPersons(prevPersons => {
            const newPersons = [...prevPersons];
            const draggedPerson = newPersons[dragIndex];
            newPersons.splice(dragIndex, 1);
            newPersons.splice(hoverIndex, 0, draggedPerson);
            setFormData(prev => ({
                ...prev,
                assignedPersons: [...newPersons]
            }));
            return newPersons;
        });
    };

    const handleTechnicianSelect = (technician) => {
        setFormData(prev => ({
            ...prev,
            Material_Data: prev.Material_Data.map((item, index) =>
                index === 0
                    ? {
                        ...item,
                        technicians: item.technicians.includes(technician)
                            ? item.technicians.filter(tech => tech !== technician)
                            : [...item.technicians, technician]
                    }
                    : item
            )
        }));
        if (errors.technicians) {
            setErrors(prev => ({ ...prev, technicians: '' }));
        }
    };

    const handleAddNewTechnician = () => {
        if (newTechnician.trim()) {
            setTechnicians(prev => [...prev, newTechnician.trim()]);
            setFormData(prev => ({
                ...prev,
                Material_Data: prev.Material_Data.map((item, index) =>
                    index === 0
                        ? { 
                            ...item, 
                            technicians: [...item.technicians, newTechnician.trim()] 
                        }
                        : item
                )
            }));
            setNewTechnician('');
            setShowNewTechnicianInput(false);
            if (errors.technicians) {
                setErrors(prev => ({ ...prev, technicians: '' }));
            }
        }
    };

    const handleGlobalStatusSelect = (isCustom) => {
        if (isCustom) {
            setIsCustomGlobalStatus(true);
        } else {
            setFormData(prev => ({
                ...prev,
                Material_Data: prev.Material_Data.map((item, index) =>
                    index === 0 ? { ...item, globalStatus: defaultGlobalStatus } : item
                )
            }));
            setIsCustomGlobalStatus(false);
        }
        if (errors.globalStatus) {
            setErrors(prev => ({ ...prev, globalStatus: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        const requiredFields = ['attributionDate', 'technicians', 'globalStatus', 'technicalDiagnostic', 'actionTaken', 'proposedActions'];
        requiredFields.forEach(field => {
            if (field === 'technicians') {
                if (!formData.Material_Data[0].technicians || formData.Material_Data[0].technicians.length === 0) {
                    newErrors[field] = 'Au moins un technicien doit être sélectionné';
                }
            } else if (!formData.Material_Data[0][field]) {
                newErrors[field] = 'Ce champ est obligatoire';
            }
        });
        if (selectedPersons.length === 0) {
            newErrors.assignedPerson = 'Une personne doit être sélectionnée';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            Material_Data: prev.Material_Data.map((item, index) =>
                index === 0
                    ? { ...item, [name]: value }
                    : item
            )
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleExport = async () => {
        if (validateForm()) {
            try {
                setMessage({ type: 'info', text: 'Création du document en cours...' });
                const response = await fetch('http://localhost:3001/exportation/Panne', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });
                if (response.ok) {
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `${formData.fileName}.docx`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
                    setMessage({ type: 'success', text: 'Document créé et téléchargé avec succès!' });
                    setTimeout(() => {
                        setMessage({ type: '', text: '' });
                        onClose();
                    }, 2000);
                } else {
                    const errorData = await response.json();
                    setMessage({ 
                        type: 'error', 
                        text: errorData.message || 'Erreur lors de la création du document' 
                    });
                }
            } catch (error) {
                console.error('Error:', error);
                setMessage({ 
                    type: 'error', 
                    text: 'Erreur de connexion au serveur' 
                });
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="export-material-container">
                <h2 className="form-title">Exporter le Matériel</h2>
                {message.text && (
                    <div className={`message ${message.type}`}>
                        {message.text}
                    </div>
                )}
                <form className="export-material-form" onSubmit={(e) => e.preventDefault()}>
                    <div className="form-columns">
                        <div className="form-column">
                            <div className="form-group">
                                <label>Nom du fichier</label>
                                <input
                                    type="text"
                                    name="fileName"
                                    value={formData.fileName}
                                    onChange={handleInputChange}
                                    placeholder="Nom du fichier d'export"
                                />
                            </div>
                            <div className="form-group">
                                <label>Unité</label>
                                <input
                                    type="text"
                                    name="unit"
                                    value={formData.Material_Data[0]?.unit || ''}
                                    readOnly
                                />
                            </div>
                            <div className="form-group">
                                <label>Date d'entrée</label>
                                <input
                                    type="text"
                                    name="entryDate"
                                    value={formData.Material_Data[0]?.entryDate || ''}
                                    readOnly
                                />
                            </div>
                            <div className="form-group">
                                <label>Matériel</label>
                                <input
                                    type="text"
                                    name="material"
                                    value={formData.Material_Data[0]?.material || ''}
                                    readOnly
                                />
                            </div>
                            <div className="form-group">
                                <label>Modèle</label>
                                <input
                                    type="text"
                                    name="model"
                                    value={formData.Material_Data[0]?.model || ''}
                                    readOnly
                                />
                            </div>
                            <div className="form-group">
                                <label>Numéro de série</label>
                                <input
                                    type="text"
                                    name="serialNumber"
                                    value={formData.Material_Data[0]?.serialNumber || ''}
                                    readOnly
                                />
                            </div>
                            <div className="form-group">
                                <label>Situation</label>
                                <input
                                    type="text"
                                    name="situation"
                                    value={formData.Material_Data[0]?.situation || ''}
                                    readOnly
                                />
                            </div>
                            <div className="form-group">
                                <label>Date d'attribution </label>
                                <input
                                    type="date"
                                    name="attributionDate"
                                    value={formData.Material_Data[0]?.attributionDate || ''}
                                    onChange={handleInputChange}
                                    className={errors.attributionDate ? 'error' : ''}
                                />
                                {errors.attributionDate && (
                                    <span className="error-message">{errors.attributionDate}</span>
                                )}
                            </div>
                            <div className="form-group">
                                <label>Technicien(s)</label>
                                <div className="technician-selector">
                                    {technicians.map((tech, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            className={`technician-button ${formData.Material_Data[0].technicians?.includes(tech) ? 'selected' : ''}`}
                                            onClick={() => handleTechnicianSelect(tech)}
                                        >
                                            {tech}
                                        </button>
                                    ))}
                                    <button
                                        type="button"
                                        className="add-technician-button"
                                        onClick={() => setShowNewTechnicianInput(true)}
                                    >
                                        +
                                    </button>
                                </div>
                                {showNewTechnicianInput && (
                                    <div className="new-technician-input">
                                        <input
                                            type="text"
                                            value={newTechnician}
                                            onChange={(e) => setNewTechnician(e.target.value)}
                                            placeholder="Nom du nouveau technicien"
                                        />
                                        <button type="button" onClick={handleAddNewTechnician}>
                                            Ajouter
                                        </button>
                                        <button
                                            type="button"
                                            className="cancel"
                                            onClick={() => {
                                                setShowNewTechnicianInput(false);
                                                setNewTechnician('');
                                            }}
                                        >
                                            Annuler
                                        </button>
                                    </div>
                                )}
                                {errors.technicians && (
                                    <span className="error-message">{errors.technicians}</span>
                                )}
                                {formData.Material_Data[0].technicians && formData.Material_Data[0].technicians.length > 0 && (
                                    <div className="selected-technicians">
                                        Techniciens sélectionnés: {formData.Material_Data[0].technicians.join(', ')}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="form-column">
                            <div className="form-group">
                                <label>Constat Global</label>
                                <div className="global-status-selector">
                                    <button
                                        type="button"
                                        className={`status-button ${!isCustomGlobalStatus ? 'selected' : ''}`}
                                        onClick={() => handleGlobalStatusSelect(false)}
                                    >
                                        Constat Par Défaut
                                    </button>
                                    <button
                                        type="button"
                                        className={`status-button ${isCustomGlobalStatus ? 'selected' : ''}`}
                                        onClick={() => handleGlobalStatusSelect(true)}
                                    >
                                        Personnalisé
                                    </button>
                                </div>
                                <div className="global-status-info">
                                    {!isCustomGlobalStatus ? 
                                        'Utilisation du constat standard. Cliquez sur "Personnalisé" pour le modifier.' :
                                        'Mode personnalisé. Modifiez le texte selon vos besoins.'}
                                </div>
                                <textarea
                                    name="globalStatus"
                                    value={formData.Material_Data[0]?.globalStatus || ''}
                                    onChange={handleInputChange}
                                    className={`${errors.globalStatus ? 'error' : ''} ${isCustomGlobalStatus ? 'editable' : ''}`}
                                    readOnly={!isCustomGlobalStatus}
                                    onClick={() => {
                                        if (!isCustomGlobalStatus) {
                                            handleGlobalStatusSelect(true);
                                        }
                                    }}
                                    placeholder={isCustomGlobalStatus ? "Entrez votre constat personnalisé..." : ""}
                                />
                                {errors.globalStatus && (
                                    <span className="error-message">{errors.globalStatus}</span>
                                )}
                            </div>
                            <div className="form-group">
                                <label>Diagnostic Technique</label>
                                <textarea
                                    name="technicalDiagnostic"
                                    value={formData.Material_Data[0]?.technicalDiagnostic || ''}
                                    onChange={handleInputChange}
                                    className={errors.technicalDiagnostic ? 'error' : ''}
                                />
                                {errors.technicalDiagnostic && (
                                    <span className="error-message">{errors.technicalDiagnostic}</span>
                                )}
                            </div>
                            <div className="form-group">
                                <label>Action Entreprise</label>
                                <textarea
                                    name="actionTaken"
                                    value={formData.Material_Data[0]?.actionTaken || ''}
                                    onChange={handleInputChange}
                                    className={errors.actionTaken ? 'error' : ''}
                                />
                                {errors.actionTaken && (
                                    <span className="error-message">{errors.actionTaken}</span>
                                )}
                            </div>
                            <div className="form-group">
                                <label>Actions Proposées</label>
                                <textarea
                                    name="proposedActions"
                                    value={formData.Material_Data[0]?.proposedActions || ''}
                                    onChange={handleInputChange}
                                    className={errors.proposedActions ? 'error' : ''}
                                />
                                {errors.proposedActions && (
                                    <span className="error-message">{errors.proposedActions}</span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="full-width-section">
                        <div className="form-group">
                            <label className="section-label">Personnes Assignées</label>
                            <div className="assigned-persons-section">
                                <select
                                    value=""
                                    onChange={(e) => handlePersonChange(e.target.value)}
                                    className="person-dropdown"
                                    disabled={selectedPersons.length >= 4}
                                >
                                    <option value="">Sélectionner une personne</option>
                                    {availablePersons.map((person) => (
                                        <option 
                                            key={person.name} 
                                            value={person.name}
                                            disabled={selectedPersons.some(p => p.name === person.name)}
                                        >
                                            {person.name}
                                        </option>
                                    ))}
                                </select>
                                <DndProvider backend={HTML5Backend}>
                                    <div className="selected-persons-container">
                                        {selectedPersons.map((person, index) => (
                                            <PersonCard
                                                key={person.name}
                                                person={person}
                                                index={index}
                                                moveCard={moveCard}
                                                handleRemovePerson={handleRemovePerson}
                                            />
                                        ))}
                                    </div>
                                </DndProvider>
                                {errors.assignedPerson && (
                                    <span className="error-message">{errors.assignedPerson}</span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="form-buttons">
                        <button type="button" className="cancel-button" onClick={onClose}>
                            Annuler
                        </button>
                        <button type="button" className="export-button" onClick={handleExport}>
                            Exporter
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ExportMaterial; 