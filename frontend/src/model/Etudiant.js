import { useState } from 'react';
import { ajouterEtudiant, modifierEtudiant, supprimerEtudiant } from "../APIs/Etudiant";
import { AddPayButton, AddPay } from './Etudiant-Paiement';
import Portal from './Portal';
import '../css/EtudiantModel.css';

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
<<<<<<< HEAD
                <div className="action-buttons">
                    {etudiant.a_paye ? 
                    <AddPayButton
                        matricule={etudiant.matricule}
                        className="btn btn-success"
                        title="Voir les détails de paiement"
                    /> :
                    <AddPay
                        etudiant={etudiant}
                        className="btn btn-warning"
                        title="Ajouter un paiement pour cet étudiant"
                    />
                    }
                    <ModifyButton 
                        studentData={etudiant}
                        refreshEtudiant={refresh}
                        className="btn btn-primary"
                        title="Modifier les informations de l'étudiant"
                    />
                    <DeleteButton 
                        refreshEtudiant={refresh}
                        matricule={etudiant.matricule}
                        className="btn btn-danger"
                        title="Supprimer cet étudiant"
                    />
                </div>
=======
                {etudiant.a_paye ? 
                // Bouton manao ny fandoavana isam-bolana
                  <AddPayButton
                    matricule={etudiant.matricule}
                  /> :
                // Bouton manao ny Premier paiement
                  <AddPay
                    etudiant={etudiant}
                    refreshEtudiant={refresh}
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
>>>>>>> b8a3594b7694d4d67c3bf8c8fedaeb8dd3f4544c
            </td>
        </tr>
    )
}

// Bouton ajouter un étudiant
function AddButton({ refreshEtudiant }) {
    const [showModal, setShowModal] = useState(false);

    const handleAdd = async (formData) => {
<<<<<<< HEAD
        const success = await ajouterEtudiant(formData)
        if (success) {
=======

        const result = await ajouterEtudiant(formData)
        if (result.success) {
>>>>>>> b8a3594b7694d4d67c3bf8c8fedaeb8dd3f4544c
            alert("Étudiant ajouté avec succès !");
            await refreshEtudiant();
            setShowModal(false);
        } else {
<<<<<<< HEAD
            alert("Échec de l'ajout de l'étudiant. Veuillez vérifier que le matricule n'existe pas déjà.");
=======
            alert(result.error);
>>>>>>> b8a3594b7694d4d67c3bf8c8fedaeb8dd3f4544c
        }
    };

    return (
        <>
            <button className="btn btn-primary" onClick={() => setShowModal(true)} title="Ajouter un nouvel étudiant">
                ➕ Ajouter un étudiant
            </button>
            {showModal && (
                <Portal>
                    <ModalAdd 
                        onClose={() => setShowModal(false)} 
                        onSubmit={handleAdd} 
                    />
                </Portal>
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
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "contact") {
        // Contact : uniquement des chiffres
        const onlyDigits = value.replace(/\D/g, "");
        setFormData(prev => ({ ...prev, [name]: onlyDigits }));
    } else if (name === "nom" || name === "prenom") {
        // Nom & Prénom : uniquement lettres, espaces, tirets, apostrophes
        const onlyLetters = value.replace(/[^\p{L} '-]/gu, "");
        setFormData(prev => ({ ...prev, [name]: onlyLetters }));
    } else if (name === "date_naiss") {
        // Vérification âge >= 12 ans
        const birthDate = new Date(value);
        const today = new Date();
        const minDate = new Date(
            today.getFullYear() - 12,
            today.getMonth(),
            today.getDate()
        );

        if (birthDate > minDate) {
            alert("L'âge doit être d'au moins 12 ans.");
            return; // on ne sauvegarde pas la date invalide
        }

        setFormData(prev => ({ ...prev, [name]: value }));
<<<<<<< HEAD
        // Effacer l'erreur quand l'utilisateur modifie le champ
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };
    
    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        
        // Validation immédiate pour un meilleur feedback
        if (step === 1) validateStep1(true, name);
        else if (step === 2) validateStep2(true, name);
    };
    
    const validateStep1 = (partial = false, fieldName = null) => {
        const newErrors = {};
        
        const validations = {
            nom: () => {
                if (!formData.nom.trim()) return 'Le nom est requis';
                if (formData.nom.trim().length < 2) return 'Le nom doit contenir au moins 2 caractères';
                return '';
            },
            prenom: () => {
                if (!formData.prenom.trim()) return 'Le prénom est requis';
                if (formData.prenom.trim().length < 2) return 'Le prénom doit contenir au moins 2 caractères';
                return '';
            },
            contact: () => {
                if (!formData.contact.trim()) return 'Le contact est requis';
                const phoneRegex = /^(\+?\d{1,4}?[-.\s]?)?(\(?\d{1,3}?\)?[-.\s]?)?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
                if (!phoneRegex.test(formData.contact)) return 'Le format du contact est invalide';
                return '';
            },
            sexe: () => {
                if (!formData.sexe) return 'Le sexe est requis';
                return '';
            },
            date_naiss: () => {
                if (!formData.date_naiss) return 'La date de naissance est requise';
                const birthDate = new Date(formData.date_naiss);
                const today = new Date();
                if (birthDate >= today) return 'La date de naissance doit être dans le passé';
                const age = today.getFullYear() - birthDate.getFullYear();
                if (age < 15 || age > 100) return 'L\'âge doit être entre 15 et 100 ans';
                return '';
            },
            sit_parent: () => {
                if (!formData.sit_parent) return 'La situation parentale est requise';
                return '';
            }
        };
        
        if (partial && fieldName && validations[fieldName]) {
            const error = validations[fieldName]();
            if (error) newErrors[fieldName] = error;
        } else {
            Object.keys(validations).forEach(key => {
                const error = validations[key]();
                if (error) newErrors[key] = error;
            });
        }
        
        setErrors(prev => ({ ...prev, ...newErrors }));
        return Object.keys(newErrors).length === 0;
    };
    
    const validateStep2 = (partial = false, fieldName = null) => {
        const newErrors = {};
        
        const validations = {
            matricule: () => {
                if (!formData.matricule.trim()) return 'Le matricule est requis';
                if (formData.matricule.trim().length < 3) return 'Le matricule doit contenir au moins 3 caractères';
                return '';
            },
            etablissement: () => {
                if (!formData.etablissement.trim()) return 'L\'établissement est requis';
                if (formData.etablissement.trim().length < 3) return 'Le nom de l\'établissement doit contenir au moins 3 caractères';
                return '';
            },
            niveau: () => {
                if (!formData.niveau) return 'Le niveau est requis';
                return '';
            }
        };
        
        if (partial && fieldName && validations[fieldName]) {
            const error = validations[fieldName]();
            if (error) newErrors[fieldName] = error;
        } else {
            Object.keys(validations).forEach(key => {
                const error = validations[key]();
                if (error) newErrors[key] = error;
            });
        }
        
        setErrors(prev => ({ ...prev, ...newErrors }));
        return Object.keys(newErrors).length === 0;
    };
    
    const handleNext = () => {
        if (validateStep1()) {
            setStep(2);
        } else {
            // Marquer tous les champs comme touchés pour afficher les erreurs
            const allTouched = {};
            Object.keys(formData).forEach(key => {
                if (key !== 'date_inscription') allTouched[key] = true;
            });
            setTouched(allTouched);
        }
    };
    
    const handleBack = () => setStep(1);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateStep2()) {
            onSubmit(formData);
        } else {
            // Marquer tous les champs comme touchés pour afficher les erreurs
            const allTouched = {};
            Object.keys(formData).forEach(key => {
                allTouched[key] = true;
            });
            setTouched(allTouched);
        }
    };
=======
    } else {
        // Autres champs : inchangés
        setFormData(prev => ({ ...prev, [name]: value }));
    }
};

    
 const handleNext = () => {
    const { nom, contact, sexe, date_naiss, sit_parent } = formData;

    // Vérification si tous les champs du step 1 sont remplis
    if (!nom || !contact || !sexe || !date_naiss || !sit_parent) {
        alert("Veuillez remplir tous les champs obligatoires avant de continuer.");
        return;
    }

    // Vérification du contact (10 chiffres + format correct)
    if (contact.length !== 10) {
        alert("Veuillez entrer un numéro correct : 10 chiffres requis.");
        return;
    }

    // Cas 1 : commence par 02
    if (contact.startsWith("02")) {
        setStep(2);
        return;
    }

    // Cas 2 : commence par 03 + 3e chiffre valide
    if (contact.startsWith("03")) {
        const thirdDigit = contact[2]; // le 3e caractère
        const validDigits = ["2", "3", "4", "7", "8", "9"];
        if (validDigits.includes(thirdDigit)) {
            setStep(2);
            return;
        }
    }

    // Si aucune condition n'est remplie
    alert("Veuillez entrer un numéro correct.");
};


    const handleBack = () => setStep(1);
    
    const handleSubmit = (e) => {
    e.preventDefault();

    const contact = formData.contact;

    // Vérification si c'est bien 10 chiffres
    if (contact.length !== 10) {
        alert("Veuillez entrer un numéro correct.");
        return;
    }

    // Cas 1 : commence par 02
    if (contact.startsWith("02")) {
        onSubmit(formData);
        return;
    }

    // Cas 2 : commence par 03 et le 3e chiffre est valide
    if (contact.startsWith("03")) {
        const thirdDigit = contact[2]; // le 3e caractère (après 03)
        const validDigits = ["2", "3", "4", "7", "8", "9"];
        if (validDigits.includes(thirdDigit)) {
            onSubmit(formData);
            return;
        }
    }

    // Si aucune condition n'est remplie
    alert("Veuillez entrer un numéro correct.");
};

>>>>>>> b8a3594b7694d4d67c3bf8c8fedaeb8dd3f4544c
    
    return (
        <form onSubmit={handleSubmit}>
            <div className="modal-header">
                <h2 className="modal-title">Ajouter un étudiant</h2>
                <button type="button" className="modal-close" onClick={onCancel} aria-label="Fermer">×</button>
            </div>
            
            <div className="modal-body">
                <div className="form-progress">
                    <div className="form-steps">
                        <div className={`step ${step === 1 ? 'active' : ''}`}>
                            <span className="step-number">1</span>
                            <span className="step-label">Informations personnelles</span>
                        </div>
                        <div className={`step ${step === 2 ? 'active' : ''}`}>
                            <span className="step-number">2</span>
                            <span className="step-label">Informations académiques</span>
                        </div>
                    </div>
                    <div className="progress-bar">
                        <div className={`progress ${step === 1 ? 'half' : 'full'}`}></div>
                    </div>
                </div>
                
                {step === 1 && (
                    <>
                        <fieldset className="form-fieldset">
                            <legend className="form-legend">Informations personnelles</legend>
                            <p className="form-help">Renseignez les informations personnelles de l'étudiant. Tous les champs marqués d'un * sont obligatoires.</p>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Nom *</label>
                                    <input 
                                        type="text" 
                                        className={`form-input ${errors.nom && touched.nom ? 'error' : ''}`} 
                                        name="nom" 
                                        value={formData.nom} 
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        required 
                                        aria-describedby={errors.nom && touched.nom ? "nom-error" : undefined}
                                    />
                                    {errors.nom && touched.nom && <span id="nom-error" className="error-message">{errors.nom}</span>}
                                </div>
                                
                                <div className="form-group">
                                    <label className="form-label">Prénoms *</label>
                                    <input 
                                        type="text" 
                                        className={`form-input ${errors.prenom && touched.prenom ? 'error' : ''}`} 
                                        name="prenom" 
                                        value={formData.prenom} 
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        required 
                                        aria-describedby={errors.prenom && touched.prenom ? "prenom-error" : undefined}
                                    />
                                    {errors.prenom && touched.prenom && <span id="prenom-error" className="error-message">{errors.prenom}</span>}
                                </div>
                            </div>
<<<<<<< HEAD
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Contact *</label>
                                    <input 
                                        type="text" 
                                        className={`form-input ${errors.contact && touched.contact ? 'error' : ''}`} 
                                        name="contact" 
                                        value={formData.contact} 
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        required 
                                        placeholder="Ex: +225 07 08 09 10 11"
                                        aria-describedby={errors.contact && touched.contact ? "contact-error" : undefined}
                                    />
                                    {errors.contact && touched.contact && <span id="contact-error" className="error-message">{errors.contact}</span>}
                                    <div className="form-hint">Format: numéro de téléphone valide</div>
                                </div>
                                
                                <div className="form-group">
                                    <label className="form-label">Sexe *</label>
                                    <select 
                                        className={`form-select ${errors.sexe && touched.sexe ? 'error' : ''}`} 
                                        name="sexe" 
                                        value={formData.sexe} 
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        required 
                                        aria-describedby={errors.sexe && touched.sexe ? "sexe-error" : undefined}
                                    >
                                        <option value="">Sélectionnez le sexe</option>
                                        <option value="Masculin">Masculin</option>
                                        <option value="Feminin">Féminin</option>
                                    </select>
                                    {errors.sexe && touched.sexe && <span id="sexe-error" className="error-message">{errors.sexe}</span>}
                                </div>
=======
                            <div>
                                <label>Prénoms </label>
                                <input type="text" name="prenom" value={formData.prenom} onChange={handleChange}/>
>>>>>>> b8a3594b7694d4d67c3bf8c8fedaeb8dd3f4544c
                            </div>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Date de naissance *</label>
                                    <input 
                                        type="date" 
                                        className={`form-input ${errors.date_naiss && touched.date_naiss ? 'error' : ''}`} 
                                        name="date_naiss" 
                                        value={formData.date_naiss} 
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        required 
                                        aria-describedby={errors.date_naiss && touched.date_naiss ? "date_naiss-error" : undefined}
                                    />
                                    {errors.date_naiss && touched.date_naiss && <span id="date_naiss-error" className="error-message">{errors.date_naiss}</span>}
                                </div>
                                
                                <div className="form-group">
                                    <label className="form-label">Situation parentale *</label>
                                    <select 
                                        className={`form-select ${errors.sit_parent && touched.sit_parent ? 'error' : ''}`} 
                                        name="sit_parent" 
                                        value={formData.sit_parent} 
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        required 
                                        aria-describedby={errors.sit_parent && touched.sit_parent ? "sit_parent-error" : undefined}
                                    >
                                        <option value="">Sélectionnez la situation</option>
                                        <option value="Maries">Mariés</option>
                                        <option value="Veuf(ve)">Veuf ou Veuve</option>
                                        <option value="Morts">Morts</option>
                                        <option value="Divorces">Divorcés</option>
                                    </select>
                                    {errors.sit_parent && touched.sit_parent && <span id="sit_parent-error" className="error-message">{errors.sit_parent}</span>}
                                </div>
                            </div>
                        </fieldset>
<<<<<<< HEAD
                        
                        <div className="form-navigation">
                            <div></div>
                            <button type="button" className="btn btn-primary" onClick={handleNext}>
                                Suivant →
                            </button>
=======
                        <div style={{ marginTop: '10px' }}>
                            <button type="button" onClick={handleNext}> Suivant </button>
>>>>>>> b8a3594b7694d4d67c3bf8c8fedaeb8dd3f4544c
                        </div>
                    </>
                )}

                {step === 2 && (
                    <>
                        <fieldset className="form-fieldset">
                            <legend className="form-legend">Informations académiques</legend>
                            <p className="form-help">Renseignez les informations académiques de l'étudiant. Tous les champs marqués d'un * sont obligatoires.</p>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Matricule *</label>
                                    <input 
                                        type="text" 
                                        className={`form-input ${errors.matricule && touched.matricule ? 'error' : ''}`} 
                                        name="matricule" 
                                        value={formData.matricule} 
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        required 
                                        aria-describedby={errors.matricule && touched.matricule ? "matricule-error" : undefined}
                                    />
                                    {errors.matricule && touched.matricule && <span id="matricule-error" className="error-message">{errors.matricule}</span>}
                                    <div className="form-hint">Le matricule doit être unique pour chaque étudiant</div>
                                </div>
                                
                                <div className="form-group">
                                    <label className="form-label">Établissement *</label>
                                    <input 
                                        type="text" 
                                        className={`form-input ${errors.etablissement && touched.etablissement ? 'error' : ''}`} 
                                        name="etablissement" 
                                        value={formData.etablissement} 
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        required 
                                        aria-describedby={errors.etablissement && touched.etablissement ? "etablissement-error" : undefined}
                                    />
                                    {errors.etablissement && touched.etablissement && <span id="etablissement-error" className="error-message">{errors.etablissement}</span>}
                                </div>
                            </div>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Niveau *</label>    
                                    <select 
                                        className={`form-select ${errors.niveau && touched.niveau ? 'error' : ''}`} 
                                        name="niveau" 
                                        value={formData.niveau} 
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        required 
                                        aria-describedby={errors.niveau && touched.niveau ? "niveau-error" : undefined}
                                    >
                                        <option value="">Sélectionnez le niveau</option>
                                        <option value="L1">L1</option>
                                        <option value="L2">L2</option>
                                        <option value="L3">L3</option>
                                        <option value="M1">M1</option>
                                        <option value="M2">M2</option>
                                    </select>
                                    {errors.niveau && touched.niveau && <span id="niveau-error" className="error-message">{errors.niveau}</span>}
                                </div> 
                                
                                <div className="form-group">
                                    <label className="form-label">Date d'inscription *</label>
                                    <input 
                                        type="date" 
                                        className="form-input" 
                                        name="date_inscription" 
                                        value={formData.date_inscription} 
                                        onChange={handleChange}
                                        required
                                        title="Date d'inscription de l'étudiant"
                                    />
                                    <div className="form-hint">Date à laquelle l'étudiant s'est inscrit</div>
                                </div>
                            </div>
                        </fieldset>
<<<<<<< HEAD
                        
                        <div className="form-navigation">
                            <button type="button" className="btn btn-secondary" onClick={handleBack}>
                                ← Précédent
                            </button>
                            <button type="submit" className="btn btn-success">
                                ✅ Ajouter l'étudiant
                            </button>
=======
                        <div style={{ marginTop: '10px' }}>
                            <button type="button" onClick={handleBack}>Précédent</button>
                            <button type="submit" style={{ marginLeft: '10px' }}>Ajouter</button>
>>>>>>> b8a3594b7694d4d67c3bf8c8fedaeb8dd3f4544c
                        </div>
                    </>
                )}
            </div>
        </form>
    );
}

// Fenêtre modale pour ajouter un étudiant
function ModalAdd({ onClose, onSubmit }){
    return (
        <div className="modal-overlay">
            <div className="modal-content">
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
        nom: initialData.nom || "",
        prenom: initialData.prenom || "",
        etablissement: initialData.etablissement || "",
        niveau: initialData.niveau || "",
        contact: initialData.contact || "",
        sexe: initialData.sexe || "",
        date_naiss: initialData.date_naiss ? new Date(initialData.date_naiss).toISOString().split("T")[0] : "",
        sit_parent: initialData.sit_parent || "",
        matricule: initialData.matricule || "",
    });
    
    const [step, setStep] = useState(1);
    const [errors, setErrors] = useState({});
    
    const handleChange = (e) => {
<<<<<<< HEAD
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateStep1 = () => {
        const newErrors = {};
        if (!formData.nom) newErrors.nom = 'Le nom est requis';
        if (!formData.prenom) newErrors.prenom = 'Le prénom est requis';
        if (!formData.contact) newErrors.contact = 'Le contact est requis';
        if (!formData.sexe) newErrors.sexe = 'Le sexe est requis';
        if (!formData.date_naiss) newErrors.date_naiss = 'La date de naissance est requise';
        if (!formData.sit_parent) newErrors.sit_parent = 'La situation parentale est requise';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const validateStep2 = () => {
        const newErrors = {};
        if (!formData.nouv_matricule) newErrors.nouv_matricule = 'Le matricule est requis';
        if (!formData.etablissement) newErrors.etablissement = "L'établissement est requis";
        if (!formData.niveau) newErrors.niveau = 'Le niveau est requis';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const handleNext = () => {
        if (validateStep1()) {
            setStep(2);
        }
    };
    
    const handleBack = () => setStep(1);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateStep2()) {
            onSubmit(formData);
        }
    };
=======
     const { name, value } = e.target;

    if (name === "contact") {
        // Contact : uniquement des chiffres
        const onlyDigits = value.replace(/\D/g, "");
        setFormData(prev => ({ ...prev, [name]: onlyDigits }));
    } else if (name === "nom" || name === "prenom") {
        // Nom & Prénom : lettres (y compris accents), espace, apostrophe et tiret
        const onlyLetters = value.replace(/[^\p{L} '-]/gu, "");
        setFormData(prev => ({ ...prev, [name]: onlyLetters }));
    } else {
        // Les autres champs : inchangés
        setFormData(prev => ({ ...prev, [name]: value }));
    }
    };
    
 const handleNext = () => {
    const { nom, contact, sexe, date_naiss, sit_parent } = formData;

    // Vérification si tous les champs du step 1 sont remplis
    if (!nom || !contact || !sexe || !date_naiss || !sit_parent) {
        alert("Veuillez remplir tous les champs obligatoires avant de continuer.");
        return;
    }

    // Vérification du contact (10 chiffres + format correct)
    if (contact.length !== 10) {
        alert("Veuillez entrer un numéro correct : 10 chiffres requis.");
        return;
    }

    // Cas 1 : commence par 02
    if (contact.startsWith("02")) {
        setStep(2);
        return;
    }

    // Cas 2 : commence par 03 + 3e chiffre valide
    if (contact.startsWith("03")) {
        const thirdDigit = contact[2]; // le 3e caractère
        const validDigits = ["2", "3", "4", "7", "8", "9"];
        if (validDigits.includes(thirdDigit)) {
            setStep(2);
            return;
        }
    }

    // Si aucune condition n'est remplie
    alert("Veuillez entrer un numéro correct.");
};


    const handleBack = () => setStep(1);
    
    const handleSubmit = (e) => {
    e.preventDefault();

    const contact = formData.contact;

    // Vérification si c'est bien 10 chiffres
    if (contact.length !== 10) {
        alert("Veuillez entrer un numéro correct.");
        return;
    }

    // Cas 1 : commence par 02
    if (contact.startsWith("02")) {
        onSubmit(formData);
        return;
    }

    // Cas 2 : commence par 03 et le 3e chiffre est valide
    if (contact.startsWith("03")) {
        const thirdDigit = contact[2]; // le 3e caractère (après 03)
        const validDigits = ["2", "3", "4", "7", "8", "9"];
        if (validDigits.includes(thirdDigit)) {
            onSubmit(formData);
            return;
        }
    }

    // Si aucune condition n'est remplie
    alert("Veuillez entrer un numéro correct.");
};
>>>>>>> b8a3594b7694d4d67c3bf8c8fedaeb8dd3f4544c
    
    return (
        <form onSubmit={handleSubmit}>
            <div className="modal-header">
                <h2 className="modal-title">Modifier l'étudiant</h2>
                <button type="button" className="modal-close" onClick={onCancel}>×</button>
            </div>
            
            <div className="modal-body">
                <div className="form-steps">
                    <div className={`step ${step === 1 ? 'active' : ''}`}>1</div>
                    <div className={`step ${step === 2 ? 'active' : ''}`}>2</div>
                </div>
                
                {step === 1 && (
                    <>
                        <fieldset className="form-fieldset">
                            <legend className="form-legend">Informations personnelles</legend>
                            
                            <div className="form-group">
                                <label className="form-label">Nom *</label>
                                <input type="text" className="form-input" name="nom" value={formData.nom} onChange={handleChange} required />
                                {errors.nom && <span style={{color: 'red', fontSize: '0.8rem'}}>{errors.nom}</span>}
                            </div>
<<<<<<< HEAD
                            
                            <div className="form-group">
                                <label className="form-label">Prénoms *</label>
                                <input type="text" className="form-input" name="prenom" value={formData.prenom} onChange={handleChange} required />
                                {errors.prenom && <span style={{color: 'red', fontSize: '0.8rem'}}>{errors.prenom}</span>}
=======
                            <div>
                                <label>Prénoms </label>
                                <input type="text" name="prenom" value={formData.prenom} onChange={handleChange}/>
>>>>>>> b8a3594b7694d4d67c3bf8c8fedaeb8dd3f4544c
                            </div>
                            
                            <div className="form-group">
                                <label className="form-label">Contact *</label>
                                <input type="text" className="form-input" name="contact" value={formData.contact} onChange={handleChange} required />
                                {errors.contact && <span style={{color: 'red', fontSize: '0.8rem'}}>{errors.contact}</span>}
                            </div>
                            
                            <div className="form-group">
                                <label className="form-label">Sexe *</label>
                                <select className="form-select" name="sexe" value={formData.sexe} onChange={handleChange} required>
                                    <option value="">Sélectionnez le sexe</option>
                                    <option value="Masculin">Masculin</option>
                                    <option value="Feminin">Féminin</option>
                                </select>
                                {errors.sexe && <span style={{color: 'red', fontSize: '0.8rem'}}>{errors.sexe}</span>}
                            </div>
                            
                            <div className="form-group">
                                <label className="form-label">Date de naissance *</label>
                                <input type="date" className="form-input" name="date_naiss" value={formData.date_naiss} onChange={handleChange} required />
                                {errors.date_naiss && <span style={{color: 'red', fontSize: '0.8rem'}}>{errors.date_naiss}</span>}
                            </div>
                            
                            <div className="form-group">
                                <label className="form-label">Situation parentale *</label>
                                <select className="form-select" name="sit_parent" value={formData.sit_parent} onChange={handleChange} required>
                                    <option value="">Sélectionnez la situation</option>
                                    <option value="Maries">Mariés</option>
                                    <option value="Veuf(ve)">Veuf ou Veuve</option>
                                    <option value="Morts">Morts</option>
                                    <option value="Divorces">Divorcés</option>
                                </select>
                                {errors.sit_parent && <span style={{color: 'red', fontSize: '0.8rem'}}>{errors.sit_parent}</span>}
                            </div>
                        </fieldset>
                        
                        <div className="form-navigation">
                            <div></div>
                            <button type="button" className="btn btn-primary" onClick={handleNext}>
                                Suivant →
                            </button>
                        </div>
                    </>
                )}

                {step === 2 && (
                    <>
                        <fieldset className="form-fieldset">
                            <legend className="form-legend">Informations académiques</legend>
                            
                            <div className="form-group">
                                <label className="form-label">Matricule *</label>
                                <input type="text" className="form-input" name="nouv_matricule" value={formData.nouv_matricule} onChange={handleChange} required />
                                {errors.nouv_matricule && <span style={{color: 'red', fontSize: '0.8rem'}}>{errors.nouv_matricule}</span>}
                            </div>
                            
                            <div className="form-group">
                                <label className="form-label">Établissement *</label>
                                <input type="text" className="form-input" name="etablissement" value={formData.etablissement} onChange={handleChange} required />
                                {errors.etablissement && <span style={{color: 'red', fontSize: '0.8rem'}}>{errors.etablissement}</span>}
                            </div>
                            
                            <div className="form-group">
                                <label className="form-label">Niveau *</label>
                                <select className="form-select" name="niveau" value={formData.niveau} onChange={handleChange} required>
                                    <option value="">Sélectionnez le niveau</option>
                                    <option value="L1">L1</option>
                                    <option value="L2">L2</option>
                                    <option value="L3">L3</option>
                                    <option value="M1">M1</option>
                                    <option value="M2">M2</option>
                                </select>
                                {errors.niveau && <span style={{color: 'red', fontSize: '0.8rem'}}>{errors.niveau}</span>}
                            </div>
                        </fieldset>
                        
                        <div className="form-navigation">
                            <button type="button" className="btn btn-secondary" onClick={handleBack}>
                                ← Précédent
                            </button>
                            <button type="submit" className="btn btn-success">
                                ✅ Enregistrer les modifications
                            </button>
                        </div>
                    </>
                )}
            </div>
        </form>
    );
}

// Bouton modifier un étudiant
function ModifyButton({ studentData, refreshEtudiant, className = '' }) {
    const [showModal, setShowModal] = useState(false);
    
    const handleModify = async (updatedStudent) => {
        const success = await modifierEtudiant(updatedStudent);
        if(success) {    
            await refreshEtudiant();
            alert("Étudiant modifié avec succès !");
        } else {
            alert("Échec de la modification de l'étudiant.");
        }
        setShowModal(false);
    };

    return (
        <>
            <button className={`btn btn-primary ${className}`} onClick={() => setShowModal(true)}>
                ✏️ Modifier
            </button>
            {showModal && (
                <Portal>
                    <ModalModify
                        onClose={() => setShowModal(false)}
                        onSubmit={handleModify}
                        studentData={studentData}
                    />
                </Portal>
            )}
        </>
    );
}

// Fenêtre modale pour modifier un étudiant
function ModalModify({ onClose, onSubmit, studentData }) {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <ModifyForm 
                    onSubmit={onSubmit} 
                    onCancel={onClose} 
                    initialData={studentData}
                />
            </div>
        </div>
    );
}

// Bouton supprimer un étudiant
function DeleteButton({ matricule, refreshEtudiant, className = '' }){
    const [showConfirm, setShowConfirm] = useState(false);
    
    const handleSubmit = async () => {
        // eslint-disable-next-line no-template-curly-in-string
        const confirmDelete = window.confirm(`Voulez-vous vraiment supprimer l'étudiant avec le matricule ${matricule} ?`);
        if (!confirmDelete) return;
        try {
            const success = await supprimerEtudiant(matricule);
            if (success) {
                await refreshEtudiant();
                alert("Étudiant supprimé avec succès !");
            } else {
                alert("Échec de la suppression.");
            }
        } catch (error) {
            console.error("Erreur de suppression :", error);
            alert("Une erreur est survenue lors de la suppression.");
        }
        setShowConfirm(false);
    };
    
    const handleCancel = () => {
        setShowConfirm(false);
    };
    
    return(
        <>
            <button className={`btn btn-danger ${className}`} onClick={() => setShowConfirm(true)}>
                🗑️ Supprimer
            </button>
            
            {showConfirm && (
                <Portal>
                    <div className="modal-overlay">
                        <div className="modal-content" style={{maxWidth: '400px'}}>
                            <div className="modal-header">
                                <h2 className="modal-title">Confirmer la suppression</h2>
                                <button type="button" className="modal-close" onClick={handleCancel}>×</button>
                            </div>
                            <div className="modal-body">
                                <p>Êtes-vous sûr de vouloir supprimer cet étudiant ? Cette action est irréversible.</p>
                                <div className="form-navigation">
                                    <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                                        Annuler
                                    </button>
                                    <button type="button" className="btn btn-danger" onClick={handleSubmit}>
                                        Confirmer la suppression
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Portal>
            )}
        </>
    );
}

export { ListeEtudiant, ModalAdd, AddButton, AddForm };