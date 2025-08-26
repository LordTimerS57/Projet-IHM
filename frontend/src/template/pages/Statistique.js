/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { fetchMontantPaiement } from '../../APIs/InfoGeneral';
import { BarChart } from '@mui/x-charts/BarChart';
import '../../css/Statistique.css';

function Statistiques() {
  const [chartData, setChartData] = useState(null);
  const [totalPaiement, setTotalPaiement] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dictionnaire pour corriger les mois avec accents
  const moisAvecAccents = {
    Janvier: 'Janvier',
    Fevrier: 'Février',
    Mars: 'Mars',
    Avril: 'Avril',
    Mai: 'Mai',
    Juin: 'Juin',
    Juillet: 'Juillet',
    Aout: 'Août',
    Septembre: 'Septembre',
    Octobre: 'Octobre',
    Novembre: 'Novembre',
    Decembre: 'Décembre',
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const StatData = await fetchMontantPaiement();
        const groupedData = groupDataByAnneeAndMois(StatData);
        const formattedChartData = formatDataForChart(groupedData.group);
        setChartData(formattedChartData);
        setTotalPaiement(groupedData.total);
      } catch (err) {
        setError('Erreur lors du chargement des statistiques. Veuillez réessayer.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Regrouper les paiements par année et mois avec correction des mois
  function groupDataByAnneeAndMois(data) {
    const grouped = {};

    data.montantParMoisAnnee.forEach((item) => {
      const [mois, annee] = item.mois_paye.split(' ');
      const moisCorrige = moisAvecAccents[mois] || mois;
      if (!grouped[annee]) {
        grouped[annee] = {};
      }
      grouped[annee][moisCorrige] = item.total_paiement;
    });

    return {
      group: grouped,
      total: data.totalPaiement,
    };
  }

  // Formater les données pour BarChart : x = années, séries = mois
  const formatDataForChart = (groupedData) => {
    const listeMois = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];

    const annees = Object.keys(groupedData).sort();

    const series = listeMois.map((mois) => ({
      label: mois,
      data: annees.map((annee) => groupedData[annee]?.[mois] || 0),
    }));

    return {
      xAxisLabels: annees,
      series,
    };
  };

  return (
    <div className="page-content">
      <div className="container">
        <header className="page-header">
          <h1>Statistiques des Paiements</h1>
          <p>Visualisez les tendances des paiements au fil du temps</p>
        </header>

        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Chargement des statistiques...</p>
          </div>
        )}

        {error && (
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="retry-button">
              Réessayer
            </button>
          </div>
        )}

        {chartData && !loading && (
          <div className="stats-content">
            <div className="total-payment-card">
              <div className="card-icon payment-icon">💰</div>
              <div className="card-content">
                <h3>Total des Paiements</h3>
                <p className="stat-number">{totalPaiement.toLocaleString('fr-FR')} Ar</p>
                <p className="stat-label">Montant total collecté</p>
              </div>
            </div>

            <div className="chart-container">
              <h2>Répartition des paiements par mois et année</h2>
              <div className="chart-wrapper">
                <BarChart
                  xAxis={[{ 
                    data: chartData.xAxisLabels,
                    scaleType: 'band',
                    label: 'Années'
                  }]}
                  series={chartData.series.map((serie) => ({
                    ...serie,
                    valueFormatter: (value) => `${value.toLocaleString('fr-FR')} Ar`,
                  }))}
                  height={400}
                  margin={{ left: 80, right: 30, top: 30, bottom: 50 }}
                  colors={['#4361ee', '#3a0ca3', '#4cc9f0', '#7209b7', '#f72585', '#4bb543', 
                          '#ff9e00', '#ff5400', '#00b4d8', '#0077b6', '#90be6d', '#577590']}
                  sx={{
                    '.MuiChartsAxis-label': {
                      fontSize: '14px',
                      fontWeight: '500',
                    },
                    '.MuiChartsAxis-tickLabel': {
                      fontSize: '12px',
                    },
                    '.MuiChartsLegend-series text': {
                      fontSize: '13px',
                    }
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Statistiques;