import { useEffect, useState } from 'react';
import { fetchInfoBloc, fetchInfoBlocChambre } from '../../APIs/Bloc-Chambre';
import { ListeBloc, AddModalBloc } from '../../model/Bloc-Chambre';

function Cite() {
  const [infoBloc, setInfoBloc] = useState([]);
  const [chambresParBloc, setChambresParBloc] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedBloc, setSelectedBloc] = useState(null); // 👈 Bloc actuellement sélectionné

  const fetchData = async () => {
    const BlocData = await fetchInfoBloc();

    const chambresPromises = BlocData.map(async (bloc) => {
      const chambres = await fetchInfoBlocChambre(bloc.num_bloc);
      return [bloc.num_bloc, chambres];
    });

    const chambresResults = await Promise.all(chambresPromises);
    const chambresMap = Object.fromEntries(chambresResults);

    setInfoBloc(BlocData);
    setChambresParBloc(chambresMap);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // amantarana hoe misy olona mipetraka @bloc ray
  const getEtatGeneralHabitation = (chambres) => {
    return chambres.some(c => c.habitee === true);
  };

  const lastNumBloc = infoBloc.length > 0
    ? Math.max(...infoBloc.map(b => parseInt(b.num_bloc)))
    : 0;

  return (
    <div>
      {showAddModal && (
        // Formulaire d'ajout d'un bloc avec plusieurs chambres
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
          <div>
            <button onClick={() => setShowAddModal(true)} style={{ marginBottom: '10px' }}>
              ➕ Ajouter un bloc
            </button>
          </div>

          {infoBloc.map((Bloc) => {
            const chambres = chambresParBloc[Bloc.num_bloc] || [];
            const habitee = getEtatGeneralHabitation(chambres);

            return (
              <div key={Bloc.num_bloc} style={{ marginBottom: '20px' }}>
                <ListeBloc
                  numBloc={Bloc.num_bloc}
                  nomBloc={Bloc.design_bloc}
                  nbChambres={Bloc.nb_chambres}
                  habite={habitee}
                  onSelect={() => setSelectedBloc(Bloc)}
                  refresh={fetchData}
                />
              </div>
            );
          })}
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
    </div>
  );
}

export default Cite;
