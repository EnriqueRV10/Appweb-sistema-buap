import { Component, OnInit } from '@angular/core';
import { AdministradoresService } from 'src/app/services/administradores.service';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-graficas-screen',
  templateUrl: './graficas-screen.component.html',
  styleUrls: ['./graficas-screen.component.scss']
})
export class GraficasScreenComponent implements OnInit {
  public total_user: any = {};

  // Histograma
  lineChartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Registro mensual de usuarios',
        backgroundColor: '#F88406',
        borderColor: '#F88406',
        tension: 0.1
      }
    ]
  };

  lineChartOption: ChartConfiguration['options'] = {
    responsive: false,
    plugins: {
      legend: {
        display: true,
      },
      datalabels: {
        color: '#000',
        anchor: 'end',
        align: 'top',
        formatter: (value: any) => value
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  // Barras
  barChartData: ChartConfiguration['data'] = {
    labels: ["Administradores", "Maestros", "Alumnos"],
    datasets: [
      {
        data: [],
        label: 'Total de usuarios por rol',
        backgroundColor: [
          '#F88406',  // Naranja para Administradores
          '#FCFF44',  // Amarillo para Maestros
          '#82D3FB'   // Azul para Alumnos
        ]
      }
    ]
  };

  barChartOption: ChartConfiguration['options'] = {
    responsive: false,
    plugins: {
      legend: {
        display: false
      },
      datalabels: {
        color: '#000',
        anchor: 'end',
        align: 'top',
        offset: 4,
        formatter: (value: any) => value + ' usuarios',
        font: {
          weight: 'bold'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        },
        max: 10
      }
    },
    layout: {
      padding: {
        top: 20,
        right: 20
      }
    },
    indexAxis: 'x',
    elements: {
      bar: {
        borderWidth: 2,
      }
    }
}

  // Gráficas circulares
  pieChartData: ChartConfiguration['data'] = {
    labels: ["Administradores", "Maestros", "Alumnos"],
    datasets: [
      {
        data: [],
        label: 'Registro de usuarios',
        backgroundColor: [
          '#FCFF44',
          '#F1C8F2',
          '#31E731'
        ]
      }
    ]
  };

  pieChartOption: ChartConfiguration['options'] = {
    responsive: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom'
      },
      datalabels: {
        color: '#000',
        formatter: (value: any) => value
      }
    }
  };

  // Dona
  doughnutChartData: ChartConfiguration['data'] = {
    labels: ["Administradores", "Maestros", "Alumnos"],
    datasets: [
      {
        data: [],
        label: 'Registro de usuarios',
        backgroundColor: [
          '#F88406',
          '#FCFF44',
          '#31E7E7'
        ]
      }
    ]
  };

  doughnutChartOption: ChartConfiguration['options'] = {
    responsive: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom'
      },
      datalabels: {
        color: '#000',
        formatter: (value: any) => value
      }
    }
  };

  lineChartPlugins = [DatalabelsPlugin];
  barChartPlugins = [DatalabelsPlugin];
  pieChartPlugins = [DatalabelsPlugin];
  doughnutChartPlugins = [DatalabelsPlugin];

  constructor(
    private administradoresServices: AdministradoresService
  ) { }

  ngOnInit(): void {
    this.obtenerTotalUsers();
  }

  public obtenerTotalUsers() {
    this.administradoresServices.getTotalUsuarios().subscribe(
      (response) => {
        this.total_user = response;
        console.log("Total usuarios: ", this.total_user);
        this.actualizarGraficas();
      },
      (error) => {
        console.error('Error:', error);
        alert("No se pudo obtener el total de cada rol de usuarios");
      }
    );
  }

  public recargarDatos(): void {
    this.obtenerTotalUsers();
  }

  private actualizarGraficas() {
    const datosUsuarios = [
      this.total_user.total_admins,
      this.total_user.total_maestros,
      this.total_user.total_alumnos
    ];

    this.barChartData = {
      labels: ["Administradores", "Maestros", "Alumnos"],
      datasets: [{
        data: datosUsuarios,
        label: 'Total de usuarios por rol',
        backgroundColor: [
          '#F88406',
          '#FCFF44',
          '#82D3FB'
        ]
      }]
    };

    this.pieChartData = {
      ...this.pieChartData,
      datasets: [{
        ...this.pieChartData.datasets[0],
        data: datosUsuarios
      }]
    };

    this.doughnutChartData = {
      ...this.doughnutChartData,
      datasets: [{
        ...this.doughnutChartData.datasets[0],
        data: datosUsuarios
      }]
    };

    // Actualizar histograma con registros mensuales
    if (this.total_user.registros_mensuales) {
      const meses = Object.keys(this.total_user.registros_mensuales);
      const valores = Object.values(this.total_user.registros_mensuales) as number[];

      this.lineChartData = {
        labels: meses,
        datasets: [{
          data: valores,
          label: 'Registro mensual de usuarios',
          backgroundColor: '#F88406',
          borderColor: '#F88406',
          tension: 0.1
        }]
      };
    }
  }
}