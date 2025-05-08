/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { fetchMontantPaiement } from '../../APIs/InfoGeneral';
import { BarChart } from '@mui/x-charts/BarChart';

function Statistiques() {
  const [chartData, setChartData] = useState(null);
  const [totalPaiement, setTotalPaiement] = useState(0);

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
      const StatData = await fetchMontantPaiement();
      const groupedData = groupDataByAnneeAndMois(StatData);
      const formattedChartData = formatDataForChart(groupedData.group);
      setChartData(formattedChartData);
      setTotalPaiement(groupedData.total);
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
    <div>
      <h1>Bienvenue sur la page d'accueil</h1>
      <p>Ceci est la page d'accueil du site.</p>
      <p>Total Paiement : {totalPaiement.toLocaleString('fr-FR')} Ar</p>

      {chartData && (
        <BarChart
          xAxis={[{ data: chartData.xAxisLabels }]}
          series={chartData.series.map((serie) => ({
            ...serie,
            valueFormatter: (value) => `${value.toLocaleString('fr-FR')} Ar`,
          }))}
          height={400}
        />
      )}
    </div>
  );
}

export default Statistiques;
