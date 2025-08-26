import { useEffect, useState } from 'react';
import { fetchInfoBloc, fetchInfoBlocChambre } from '../../APIs/Bloc-Chambre';
import { ListeBloc, AddModalBloc } from '../../model/Bloc-Chambre';
import '../../css/Bloc-Chambre.css';

function Cite() {
  const [infoBloc, setInfoBloc] = useState([]);
  const [chambresParBloc, setChambresParBloc] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedBloc, setSelectedBloc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const BlocData = await fetchInfoBloc();

      const chambresPromises = BlocData.map(async (bloc) => {
        const chambres = await fetchInfoBlocChambre(bloc.num_bloc);
        return [bloc.num_bloc, chambres];
      });

      const chambresResults = await Promise.all(chambresPromises);
      const chambresMap = Object.fromEntries(chambresResults);

      setInfoBloc(BlocData);
      setChambresParBloc(chambresMap);
    } catch (err) {
      setError('Erreur lors du chargement des données. Veuillez réessayer.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getEtatGeneralHabitation = (chambres) => {
    return chambres.some(c => c.habitee === true);
  };

  const lastNumBloc = infoBloc.length > 0
    ? Math.max(...infoBloc.map(b => parseInt(b.num_bloc)))
    : 0;

  return (
    <div className="page-content">
      <div className="container">
        <header className="page-header">
          <h1>Gestion des Blocs et Chambres</h1>
          <p>Administrez les blocs et chambres de la cité universitaire</p>
        </header>

        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Chargement des données...</p>
          </div>
        )}

        {error && (
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <p>{error}</p>
            <button onClick={fetchData} className="retry-button">
              Réessayer
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {showAddModal && (
              <AddModalBloc
                onClose={() => setShowAddModal(false)}
                onSuccess={() => {
                  setShowAddModal(false);
                  fetchData();
                }}
                numBloc={parseInt(lastNumBloc) + 1}
              />
            )}

            {!selectedBloc && (
              <>
                <div className="action-bar">
                  <button 
                    onClick={() => setShowAddModal(true)} 
                    className="add-button"
                  >
                    <span className="button-icon">➕</span>
                    Ajouter un bloc
                  </button>
                </div>

                <div className="blocs-grid">
                  {infoBloc.length > 0 ? (
                    infoBloc.map((Bloc) => {
                      const chambres = chambresParBloc[Bloc.num_bloc] || [];
                      const habitee = getEtatGeneralHabitation(chambres);

                      return (
                        <ListeBloc
                          key={Bloc.num_bloc}
                          numBloc={Bloc.num_bloc}
                          nomBloc={Bloc.design_bloc}
                          nbChambres={Bloc.nb_chambres}
                          habite={habitee}
                          onSelect={() => setSelectedBloc(Bloc)}
                          refresh={fetchData}
                        />
                      );
                    })
                  ) : (
                    <div className="empty-state">
                      <div className="empty-icon">🏢</div>
                      <h3>Aucun bloc enregistré</h3>
                      <p>Commencez par ajouter votre premier bloc.</p>
                    </div>
                  )}
                </div>
              </>
            )}

            {selectedBloc && (
              <ListeBloc
                numBloc={selectedBloc.num_bloc}
                nomBloc={selectedBloc.design_bloc}
                nbChambres={selectedBloc.nb_chambres}
                habite={getEtatGeneralHabitation(chambresParBloc[selectedBloc.num_bloc] || [])}
                onBack={() => setSelectedBloc(null)} 
                refresh={fetchData}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Cite;