import { useState } from 'react';
import { ajouterEtudiant, modifierEtudiant, supprimerEtudiant } from "../APIs/Etudiant";
import { AddPayButton, AddPay } from './Etudiant-Paiement';

// Modèle de liste des étudiants 
function ListeEtudiant({ etudiant, refresh }){
    return(
        <tr>
            <td>{etudiant.matricule}</td>
            <td>{etudiant.nom + " " + etudiant.prenom}</td>
            <td>{etudiant.sexe}</td>
            <td>{etudiant.contact}</td>
            <td>{etudiant.niveau}</td>
            <td>{etudiant.etablissement}</td>
            <td>{new Date(etudiant.date_naiss).toLocaleDateString()}</td>
            <td>
                {etudiant.a_paye ? 
                // Bouton manao ny Premier paiement
                  <AddPayButton
                    matricule={etudiant.matricule}
                  /> :
                // Bouton manao ny fandoavana isam-bolana
                  <AddPay
                    etudiant={etudiant}
                  />
                }
                {/* Bouton manao modification étudiant */}
                <ModifyButton 
                    studentData={etudiant}
                    refreshEtudiant={refresh}
                />
                {
                /* 
                    Bouton manao suppression étudiant 
                */
                }
                <DeleteButton 
                    refreshEtudiant={refresh}
                    matricule={etudiant.matricule}
                />
            </td>
        </tr>
    )
}

// Bouton ajouter un étudiant
function AddButton({ refreshEtudiant }) {
    const [showModal, setShowModal] = useState(false);

    const handleAdd = async (formData) => {
        // raha hanao anle voulez vous ... dia atao eto

        const success = await ajouterEtudiant(formData)
        if (success) {
            alert("Étudiant ajouté avec succès !");
            await refreshEtudiant();
        } else {
            alert("Échec de l'ajout de l'étudiant.");
        }
        setShowModal(false);
    };

    return (
        <>
            <button onClick={() => setShowModal(true)}>Ajouter</button>
            {showModal && (
                <ModalAdd 
                    onClose={() => setShowModal(false)} 
                    onSubmit={handleAdd} 
                />
            )}
        </>
    );
}

// Formulaire ajouter un étudiant 
function AddForm({ onSubmit, onCancel }) {
    const [formData, setFormData] = useState({
        matricule: "",
        nom: "",
        prenom: "",
        etablissement: "",
        niveau: "",
        contact: "",
        sexe: "",
        date_naiss: "",
        date_inscription: new Date().toISOString().split("T")[0],
        sit_parent: ""
    });

    const [step, setStep] = useState(1); 
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleNext = () => setStep(2);
    const handleBack = () => setStep(1);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <button type="button" onClick={onCancel} style={{ marginLeft: '10px' }}>X <br/>Fermer</button>
                <legend> Ajout </legend>
            </div>
            <div>
                {step === 1 && (
                    <>
                        <fieldset>
                            <legend>Informations personnelles</legend>
                            <div>
                                <label>Nom *</label>
                                <input type="text" name="nom" value={formData.nom} onChange={handleChange} required />
                            </div>
                            <div>
                                <label>Prénoms </label>
                                <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} required />
                            </div>
                            <div>
                                <label>Contact *</label>
                                <input type="text" name="contact" value={formData.contact} onChange={handleChange} required />
                            </div>
                            <div>
                                <label>Sexe *</label>
                                <select name="sexe" value={formData.sexe} onChange={handleChange} required>
                                    <option value="" disabled>-- Séléctionnez le sexe --</option>
                                    <option value="Masculin">Masculin</option>
                                    <option value="Feminin">Féminin</option>
                                </select>
                            </div>
                            <div>
                                <label>Date de naissance *</label>
                                <input type="date" name="date_naiss" value={formData.date_naiss} onChange={handleChange} required />
                            </div>
                            <div>
                                <label>Situation parentale *</label>
                                <select name="sit_parent" value={formData.sit_parent} onChange={handleChange} required >
                                    <option value="" disabled>-- Séléctionnez la situation parentale --</option>
                                    <option value="Maries">Mariés</option>
                                    <option value="Veuf(ve)">Veuf ou Veuve</option>
                                    <option value="Morts">Morts</option>
                                    <option value="Divorces">Divorcés</option>
                                </select>
                            </div>
                        </fieldset>
                        <div style={{ marginTop: '10px' }}>
                            <button type="button" onClick={handleNext}> --- </button>
                        </div>
                    </>
                )}

                {step === 2 && (
                    <>
                        <fieldset>
                            <legend>Informations liées à l'établissement</legend>
                            <div>
                                <label>Matricule *</label>
                                <input type="text" name="matricule" value={formData.matricule} onChange={handleChange} required />
                            </div>
                            <div>
                                <label>Etablissement *</label>
                                <input type="text" name="etablissement" value={formData.etablissement} onChange={handleChange} required />
                            </div>
                            <div>
                                <label>Niveau *</label>    
                                <select name="niveau" value={formData.niveau} onChange={handleChange} required>
                                    <option value="" disabled>-- Séléctionnez le niveau --</option>
                                    <option value="L1">L1</option>
                                    <option value="L2">L2</option>
                                    <option value="L3">L3</option>
                                    <option value="M1">M1</option>
                                    <option value="M2">M2</option>
                                </select>
                            </div> 
                            <div>
                                <label>Date d'inscription *</label>
                                <input type="date" name="date_inscription" value={formData.date_inscription} onChange={handleChange}/>
                            </div>
                        </fieldset>
                        <div style={{ marginTop: '10px' }}>
                            <button type="button" onClick={handleBack}>---</button>
                            <button type="submit" style={{ marginLeft: '10px' }}>Ajouter</button>
                        </div>
                    </>
                )}
            </div>
        </form>
    );
}

// Fenêtre misy an'ilay Formulaire ajouter un étudiant 
function ModalAdd({ onClose, onSubmit }){
    return (
        <div style={{
            position: "fixed", top: 0, left: 0, width: "100%",
            height: "100%", backgroundColor: "rgba(0,0,0,0.5)"
        }}>
            <div style={{
                background: "#fff", margin: "5% auto", padding: 20,
                width: "fit-content", maxWidth: "90%"
            }}>
                <AddForm 
                    onSubmit={onSubmit} 
                    onCancel={onClose} 
                    />
            </div>
        </div>
    );
}

// Formulaire modifier un étudiant
function ModifyForm({ onSubmit, onCancel, initialData = {} }) {
    const [formData, setFormData] = useState({
        nouv_matricule: initialData.matricule || "",
        nom: "",
        prenom: "",
        etablissement: "",
        niveau: "",
        contact: "",
        sexe: "",
        date_naiss: "",
        sit_parent: "",
        matricule: initialData.matricule || "", // Valeur de départ non modifiable
        ...initialData,
    });
    
    const [step, setStep] = useState(1);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNext = () => setStep(2);
    const handleBack = () => setStep(1);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <button type="button" onClick={onCancel} style={{ float: 'right' }}>X<br />Fermer</button>
                <legend>Modification</legend>
            </div>
            <div>
                {step === 1 && (
                    <>
                        <fieldset>
                            <legend>Informations personnelles</legend>
                            <div>
                                <label>Nom *</label>
                                <input type="text" name="nom" value={formData.nom} onChange={handleChange} required />
                            </div>
                            <div>
                                <label>Prénoms </label>
                                <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} required />
                            </div>
                            <div>
                                <label>Contact *</label>
                                <input type="text" name="contact" value={formData.contact} onChange={handleChange} required />
                            </div>                         
                            <div>
                                <label>Sexe *</label>
                                <select name="sexe" value={formData.sexe} onChange={handleChange} required>
                                    <option value="" disabled>-- Séléctionner z-</option>
                                    <option value="Masculin">Masculin</option>
                                    <option value="Feminin">Féminin</option>
                                </select>
                            </div>
                            <div>
                                <label>Date de naissance *</label>    
                                <input type="date" name="date_naiss" value={new Date(formData.date_naiss).toISOString().split("T")[0]} onChange={handleChange} required />
                            </div>

                            <div>
                                <label>Situation parentale *</label>
                                <select name="sit_parent" value={formData.sit_parent} onChange={handleChange} required>
                                    <option value="" disabled>-- Séléctionner z-</option>
                                    <option value="Maries">Mariés</option>
                                    <option value="Veuf(ve)">Veuf(ve)</option>
                                    <option value="Morts">Morts</option>
                                    <option value="Divorces">Divorcés</option>
                                </select>
                            </div>
                        </fieldset>
                        <button type="button" onClick={handleNext}>Suivant</button>
                    </>
                )}

                {step === 2 && (
                    <>
                        <fieldset>
                            <legend>Informations liées à l’établissement</legend>
                            <div>    
                                <label>Matricule *</label>
                                <input type="text" name="nouv_matricule" value={formData.nouv_matricule} onChange={handleChange} required />
                            </div>
                            <div>
                                <label>Etablissement *</label>
                                <input type="text" name="etablissement" value={formData.etablissement} onChange={handleChange} required />
                            </div>
                            <div>
                                <label>Niveau *</label>
                                <select name="niveau" value={formData.niveau} onChange={handleChange} required>
                                    <option value="" disabled>-- Séléctionner z-</option>
                                    <option value="L1">L1</option>
                                    <option value="L2">L2</option>
                                    <option value="L3">L3</option>
                                    <option value="M1">M1</option>
                                    <option value="M2">M2</option>
                                </select>
                            </div>
                        </fieldset>
                        <button type="button" onClick={handleBack}>Précédent</button>
                        <button type="submit" style={{ marginLeft: '10px' }}>Modifier</button>
                    </>
                )}
            </div>
        </form>
    );
}

// Bouton modifier un étudiant
function ModifyButton({ studentData , refreshEtudiant }) {
    const [showModal, setShowModal] = useState(false);
    
    const handleModify = async (updatedStudent) => {
        const success = await modifierEtudiant(updatedStudent);
        if(success) 
            {    
            await refreshEtudiant();
            alert("Étudiant modifié !");
        }
        setShowModal(false);
    };

    return (
        <div>
            <button onClick={() => setShowModal(true)}>Modifier</button>
            {showModal && (
                <ModalModify
                    onClose={() => setShowModal(false)}
                    onSubmit={handleModify}
                    studentData={studentData}
                />
            )}
        </div>
    );
}

// Fenêtre misy an'ilay Formulaire modifier un étudiant
function ModalModify({ onClose, onSubmit, studentData }) {
    return (
        <div style={{
            position: "fixed",
            top: 0, left: 0, width: "100%", height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex", justifyContent: "center", alignItems: "center"
        }}>
            <div style={{
                background: "#fff",
                padding: "20px",
                borderRadius: "10px",
                width: "500px",
                maxWidth: "90%"
            }}>
                <ModifyForm 
                    onSubmit={onSubmit} 
                    onCancel={onClose} 
                    initialData={studentData}
                />
            </div>
        </div>
    );
}


// Bouton modifier un étudiant
function DeleteButton({ matricule , refreshEtudiant }){
    const handleSubmit = async () => {
        try {
            const success = await supprimerEtudiant(matricule);
            if (success) {
              await refreshEtudiant();

            } else {
              alert("Échec de la suppression.");
            }
          } catch (error) {
            console.error("Erreur de suppression :", error);
            alert("Une erreur est survenue.");
          }
    }
   
    return(
        <button onClick={handleSubmit}>Supprimer</button>
    )
}

export { ListeEtudiant, ModalAdd, AddButton, AddForm };


