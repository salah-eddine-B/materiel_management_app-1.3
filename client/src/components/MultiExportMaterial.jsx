import React, { useState, useEffect, useRef } from "react";
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Select from 'react-select';
import '../Styles/MultiExportMaterial.css';
import MergeIcon from '../assets/icon/Merge-Icon.svg';
import LockIcon from '../assets/icon/Lock-icon.svg';

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

const MultiExportMaterial = ({ isOpen, onClose, materialData }) => {
  const [fileName, setFileName] = useState('');
  const [availablePersons, setAvailablePersons] = useState([]);
  const [selectedPersons, setSelectedPersons] = useState([]);
  const [TableData, setTableData] = useState([]);
  const [globalTechnicians, setGlobalTechnicians] = useState([]);
  const [separateTechnicians, setSeparateTechnicians] = useState(false);
  const [showNewTechnicianInput, setShowNewTechnicianInput] = useState(false);
  const [newTechnician, setNewTechnician] = useState("");
  const [technicians, setTechnicians] = useState([
    'John Doe',
    'Jane Smith',
    'Mike Johnson',
    'Sarah Williams'
  ]);

  const mergeableColumns = [
    'dateAttribution',
    'datePriseEnCharge',
    'technicien',
    'constatGlobal',
    'diagnosticTechnique',
    'actionEntreprise',
    'actionsProposees',
  ];
  const columnLabels = {
    unite: 'Unité',
    materiel: 'Matériel',
    dateAttribution: "Date d'attribution",
    datePriseEnCharge: 'Date de prise en charge',
    technicien: 'Technicien',
    constatGlobal: 'Constat Global',
    diagnosticTechnique: 'Diagnostic Technique',
    actionEntreprise: 'Action Entreprise',
    actionsProposees: 'Actions Proposées',
  };
  // Set 'constatGlobal' merged by default
  const [mergedColumns, setMergedColumns] = useState({ constatGlobal: true });
  const [draggedTechnician, setDraggedTechnician] = useState(null);
  // Change technicianAssignments to be an array of arrays (multiple technicians per row)
  const [technicianAssignments, setTechnicianAssignments] = useState([]); // per-row assignment, now array of arrays
  const dragCounter = useRef(0);

  const toggleMergeColumn = (col) => {
    setMergedColumns(prev => ({ ...prev, [col]: !prev[col] }));
    // Optionally, when merging, set all values to the first row's value
    if (!mergedColumns[col] && TableData.length > 0) {
      const newData = [...TableData];
      const firstValue = newData[0][col];
      for (let i = 1; i < newData.length; i++) {
        newData[i][col] = firstValue;
      }
      setTableData(newData);
    }
  };

  useEffect(() => {
    if (isOpen && Array.isArray(materialData) && materialData.length > 0) {
      const mapped = materialData.map(mat => ({
        unite: mat.Unit || '',
        materiel: mat.Material || '',
        dateAttribution: mat.Entry_Date || '',
        datePriseEnCharge: '',
        technicien: [], // now an array for per-row assignment
        constatGlobal: '',
        diagnosticTechnique: '',
        actionEntreprise: '',
        actionsProposees: '',
      }));
      setTableData(mapped);
      setTechnicianAssignments(Array(mapped.length).fill().map(() => []));
    }
  }, [isOpen, materialData]);

  useEffect(() => {
    // Fetch available persons (simulate API call)
    const fetchAssignedPersons = async () => {
      try {
        const response = await fetch('http://localhost:3001/assignedPersons');
        const data = await response.json();
        setAvailablePersons(data.assignedPersons);
      } catch (error) {
        setAvailablePersons([]);
      }
    };
    fetchAssignedPersons();
  }, []);

  const handlePersonChange = (value) => {
    if (value && selectedPersons.length < 4) {
      const person = availablePersons.find(p => p.name === value);
      if (person && !selectedPersons.some(p => p.name === person.name)) {
        setSelectedPersons(prev => [...prev, person]);
      }
    }
  };

  const handleRemovePerson = (personName) => {
    setSelectedPersons(prev => prev.filter(p => p.name !== personName));
  };

  const moveCard = (dragIndex, hoverIndex) => {
    setSelectedPersons(prevPersons => {
      const newPersons = [...prevPersons];
      const draggedPerson = newPersons[dragIndex];
      newPersons.splice(dragIndex, 1);
      newPersons.splice(hoverIndex, 0, draggedPerson);
      return newPersons;
    });
  };

  const editableKeys = [
    'datePriseEnCharge',
    'technicien',
    'constatGlobal',
    'diagnosticTechnique',
    'actionEntreprise',
    'actionsProposees',
  ];

  const handleCellChange = (e, rowIndex, key) => {
    const newData = [...TableData];
    newData[rowIndex][key] = e.target.innerText;
    setTableData(newData);
  };

  const handleTechnicianSelect = (tech) => {
    if (globalTechnicians.includes(tech)) {
      setGlobalTechnicians(globalTechnicians.filter(t => t !== tech));
    } else {
      setGlobalTechnicians([...globalTechnicians, tech]);
    }
  };

  const handleAddNewTechnician = () => {
    if (newTechnician.trim() && !technicians.includes(newTechnician.trim())) {
      setTechnicians([...technicians, newTechnician.trim()]);
      setNewTechnician("");
      setShowNewTechnicianInput(false);
    }
  };

  // Drag-and-drop logic for technicians
  const handleTechnicianDragStart = (technician) => {
    setDraggedTechnician(technician);
  };

  const handleGlobalDrop = (e) => {
    e.preventDefault();
    if (draggedTechnician) {
      // Assign to all rows and merge column, add technician if not already present
      setTechnicianAssignments(prev => prev.map(rowTechs => rowTechs.includes(draggedTechnician) ? rowTechs : [...rowTechs, draggedTechnician]));
      setMergedColumns(prev => ({ ...prev, technicien: true }));
      setTableData(prev => prev.map(row => ({ ...row, technicien: [] })));
    }
    setDraggedTechnician(null);
    dragCounter.current = 0;
  };

  const handleGlobalDragOver = (e) => {
    e.preventDefault();
  };

  const handleGlobalDragEnter = (e) => {
    e.preventDefault();
    dragCounter.current++;
  };

  const handleGlobalDragLeave = (e) => {
    e.preventDefault();
    dragCounter.current--;
  };

  const handleCellDrop = (e, rowIndex) => {
    e.preventDefault();
    if (draggedTechnician) {
      // Unmerge if merged
      if (mergedColumns.technicien) {
        setMergedColumns(prev => ({ ...prev, technicien: false }));
      }
      // Assign only to this row, add technician if not already present
      setTechnicianAssignments(prev => {
        const newAssignments = [...prev];
        if (!newAssignments[rowIndex].includes(draggedTechnician)) {
          newAssignments[rowIndex] = [...newAssignments[rowIndex], draggedTechnician];
        }
        return newAssignments;
      });
      setTableData(prev => prev.map((row, idx) => idx === rowIndex ? { ...row, technicien: [] } : row));
    }
    setDraggedTechnician(null);
    dragCounter.current = 0;
  };

  const clearMergedTechnicians = () => {
    setMergedColumns(prev => ({ ...prev, technicien: false }));
    setTechnicianAssignments(Array(TableData.length).fill().map(() => []));
    setTableData(prev => prev.map(row => ({ ...row, technicien: [] })));
  };

  // Remove a technician from a row or from global
  const handleRemoveTechnician = (rowIndex, tech) => {
    setTechnicianAssignments(prev => {
      const newAssignments = [...prev];
      newAssignments[rowIndex] = newAssignments[rowIndex].filter(t => t !== tech);
      return newAssignments;
    });
  };
  const handleRemoveGlobalTechnician = (tech) => {
    setTechnicianAssignments(prev => prev.map(rowTechs => rowTechs.filter(t => t !== tech)));
  };

  if (!isOpen) return null;

  return (
    <div className="multi-modal-overlay">
      <div className="multi-export-material-container">
        <h2 className="form-title">Exporter Plusieurs Matériels</h2>
        <div className="multi-file-name-field">
          <label htmlFor="multi-file-name-input">Nom du fichier</label>
          <input
            id="multi-file-name-input"
            type="text"
            value={fileName}
            onChange={e => setFileName(e.target.value)}
            placeholder="Nom du fichier d'export"
          />
        </div>
        {/* Global technician selector section with drop zone */}
        <div className="technician-assignment-section">
          <h3 className="section-label">Affectation des techniciens</h3>
          <div style={{marginBottom: '0.7rem'}}>
            <label>
              <input
                type="checkbox"
                checked={separateTechnicians}
                onChange={e => setSeparateTechnicians(e.target.checked)}
                style={{marginRight: '0.5em'}}
              />
              Séparer la sélection des techniciens par matériel
            </label>
          </div>
          {!separateTechnicians && (
            <div className="technician-selector">
              {technicians.map((tech, index) => (
                <span
                  key={index}
                  className={`technician-button ${draggedTechnician === tech ? 'dragging' : ''}`}
                  draggable
                  onDragStart={() => handleTechnicianDragStart(tech)}
                  onDragEnd={() => setDraggedTechnician(null)}
                >
                  {tech}
                </span>
              ))}
              <button
                type="button"
                className="add-technician-button"
                onClick={() => setShowNewTechnicianInput(true)}
              >
                +
              </button>
            </div>
          )}
          {showNewTechnicianInput && (
            <div className="new-technician-input">
              <input
                type="text"
                value={newTechnician}
                onChange={e => setNewTechnician(e.target.value)}
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
                  setNewTechnician("");
                }}
              >
                Annuler
              </button>
            </div>
          )}
          {/* Global drop zone for merging technicians */}
          <div
            className={`global-drop-zone ${mergedColumns.technicien ? 'merged' : ''}`}
            onDragOver={handleGlobalDragOver}
            onDrop={handleGlobalDrop}
            onDragEnter={handleGlobalDragEnter}
            onDragLeave={handleGlobalDragLeave}
            style={{
              border: '2px dashed #888',
              borderRadius: 8,
              padding: 12,
              margin: '12px 0',
              background: draggedTechnician ? '#f0f8ff' : '#fafbfc',
              textAlign: 'center',
              transition: 'background 0.2s',
            }}
          >
            {mergedColumns.technicien ? (
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12}}>
                <span>Technicien global : <b>{technicianAssignments[0].length > 0 ? technicianAssignments[0].map(t => t).join(', ') : 'Aucun'}</b></span>
                <button type="button" className="unmerge-btn" onClick={clearMergedTechnicians} title="Séparer et effacer">
                  <img src={LockIcon} alt="Unmerge" style={{width: 20, height: 20, verticalAlign: 'middle'}} />
                </button>
              </div>
            ) : (
              <span style={{color: '#888'}}>Glissez un technicien ici pour l'assigner à toutes les lignes</span>
            )}
          </div>
        </div>
        <div className="multi-columns">
          <section className="multi-table-section">
            <table className="export-table">
              <thead>
                <tr>
                  {Object.keys(TableData[0] || {}).map((key, idx) => (
                    <th key={key}>
                      {columnLabels[key]}
                      {mergeableColumns.includes(key) && (
                        <span
                          style={{ cursor: 'pointer', marginLeft: 6, fontSize: '1.1em', display: 'inline-flex', alignItems: 'center' }}
                          title={mergedColumns[key] ? 'Séparer les cellules' : 'Fusionner les cellules'}
                          onClick={() => toggleMergeColumn(key)}
                        >
                          <img
                            src={mergedColumns[key] ? LockIcon : MergeIcon}
                            alt={mergedColumns[key] ? 'Séparer' : 'Fusionner'}
                            style={{ width: 20, height: 20, verticalAlign: 'middle' }}
                          />
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TableData.length === 0 ? (
                  <tr><td colSpan="9" style={{textAlign: 'center', color: '#888'}}>Aucune donnée à afficher</td></tr>
                ) : (
                  TableData.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {Object.entries(row).map(([key, value], colIndex) => {
                        if (mergedColumns[key]) {
                          if (rowIndex === 0) {
                            // Render merged cell with rowSpan and make it editable (except for 'technicien')
                            return (
                              <td key={key} rowSpan={TableData.length} style={{verticalAlign: 'middle', background: '#f6f6f6'}}
                                contentEditable={key !== 'technicien'}
                                suppressContentEditableWarning={true}
                                onBlur={key !== 'technicien' ? (e => {
                                  const newValue = e.target.innerText;
                                  const newData = [...TableData];
                                  for (let i = 0; i < newData.length; i++) {
                                    newData[i][key] = newValue;
                                  }
                                  setTableData(newData);
                                }) : undefined}
                              >
                                {key === 'technicien' ? (
                                  <div className="tech-chips">
                                    {technicianAssignments[0].length > 0 ? (
                                      technicianAssignments[0].map((tech, i) => (
                                        <span key={i} className="tech-chip">
                                          {tech}
                                          <button
                                            type="button"
                                            className="remove-tech-btn"
                                            onClick={() => handleRemoveGlobalTechnician(tech)}
                                            title="Supprimer ce technicien"
                                            style={{marginLeft: 4, color: '#c00', background: 'none', border: 'none', cursor: 'pointer'}}
                                          >
                                            ×
                                          </button>
                                        </span>
                                      ))
                                    ) : (
                                      <span style={{ color: '#bbb' }}>Aucun</span>
                                    )}
                                  </div>
                                ) : (
                                  value
                                )}
                              </td>
                            );
                          } else {
                            return null;
                          }
                        }
                        if (key === 'technicien') {
                          return (
                            <td
                              key={key}
                              onDragOver={handleGlobalDragOver}
                              onDrop={e => handleCellDrop(e, rowIndex)}
                              style={{background: draggedTechnician ? '#f0f8ff' : undefined, cursor: 'pointer'}}
                            >
                              <div className="tech-chips">
                                {technicianAssignments[rowIndex].length > 0 ? (
                                  technicianAssignments[rowIndex].map((tech, i) => (
                                    <span key={i} className="tech-chip">
                                      {tech}
                                      <button
                                        type="button"
                                        className="remove-tech-btn"
                                        onClick={() => handleRemoveTechnician(rowIndex, tech)}
                                        title="Supprimer ce technicien"
                                        style={{marginLeft: 4, color: '#c00', background: 'none', border: 'none', cursor: 'pointer'}}
                                      >
                                        ×
                                      </button>
                                    </span>
                                  ))
                                ) : (
                                  <span style={{ color: '#bbb' }}>Glissez un technicien</span>
                                )}
                              </div>
                            </td>
                          );
                        }
                        // Unmerged logic for other columns
                        return (
                          <td
                            key={key}
                            contentEditable={key !== 'technicien'}
                            suppressContentEditableWarning={true}
                            onBlur={key !== 'technicien' ? (e => {
                              const newValue = e.target.innerText;
                              const newData = [...TableData];
                              newData[rowIndex][key] = newValue;
                              setTableData(newData);
                            }) : undefined}
                            tabIndex={0}
                          >
                            {value}
                          </td>
                        );
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </section>
          <section className="multi-assigned-section">
            <label className="section-label">Personnes Assignées</label>
            <div className="assigned-persons-section">
              <select
                value=""
                onChange={e => handlePersonChange(e.target.value)}
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
            </div>
          </section>
        </div>
        <div className="multi-form-buttons">
          <button type="button" className="multi-cancel-button" onClick={onClose}>
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
};

export default MultiExportMaterial; 