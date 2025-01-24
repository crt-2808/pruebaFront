import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

// Definir los pasos del tour por vista
export const tourSteps = {
  land: (role) => {
    const steps = [
      {
        element: '.bienvenidoText',
        popover: {
          title: 'Bienvenida',
          description:
            'Este es tu espacio principal donde puedes gestionar tus actividades.',
          position: 'bottom',
        },
      },
      {
        element: '.btn-exportar',
        popover: {
          title: 'Agregar Incidencias',
          description: 'Haz clic aquí para registrar tus actividades diarias.',
          position: 'right',
        },
      },
      {
        element: '#contenedor-land',
        popover: {
          title: 'Información Principal',
          description:
            'Aquí puedes ver información sobre tu líder y acceder al planeador.',
          position: 'top',
        },
      },
      {
        element: '#perfil-lider',
        popover: {
          title: 'Lider',
          description: 'Información util sobre tu líder.',
          position: 'top',
        },
      },
      {
        element: '#btn-planeador',
        popover: {
          title: 'Planeador',
          description: 'Accede al planeador para gestionar tus actividades.',
          position: 'top',
        },
      },
      {
        element: '.user-profile',
        popover: {
          title: 'Perfil',
          description: 'Accede a tu perfil para gestionar tus datos.',
          position: 'top',
        },
      },
    ];

    // Si el usuario es coordinador, añadir pasos adicionales
    if (role === 'coordinador') {
      steps.push({
        element: '#seguimiento-equipo',
        popover: {
          title: 'Seguimiento de Cambaceos',
          description: 'Accede aquí para dar seguimiento a tu equipo.',
          position: 'left',
        },
      });
    }

    return steps;
  },
  planeador: [
    {
      element: '.regreso',
      popover: {
        title: 'Volver a Inicio',
        description: 'Haz clic aquí para regresar a la pantalla principal.',
        position: 'bottom',
      },
    },
    {
      element: '#contenedor-land',
      popover: {
        title: 'Planeador',
        description: 'Esta es tu vista principal para gestionar actividades.',
        position: 'bottom',
      },
    },
    {
      element: '#planeador-cambaceo',
      popover: {
        title: 'Cambaceo',
        description: 'Accede a la sección de Cambaceo desde aquí.',
        position: 'top',
      },
    },
    {
      element: '#planeador-visita',
      popover: {
        title: 'Visita Programada',
        description: 'Aquí puedes gestionar tus visitas programadas.',
        position: 'top',
      },
    },
    {
      element: '#planeador-llamada',
      popover: {
        title: 'Llamada',
        description: 'Haz clic para acceder a las tareas de llamadas.',
        position: 'top',
      },
    },
  ],
  cambaceoDiario: [
    {
      element: '#contenedor',
      popover: {
        title: 'Cambaceo Diario',
        description: 'Aquí puedes ver y administrar tus registros diarios.',
        position: 'bottom',
      },
    },
    {
      element: '.form-control',
      popover: {
        title: 'Buscar Registro',
        description: 'Filtra los registros por dirección usando esta barra.',
        position: 'right',
      },
    },
    {
      element: '.card',
      popover: {
        title: 'Registro',
        description: 'Este es un registro diario con sus detalles.',
        position: 'bottom',
      },
    },
    {
      element: '.btnDiario',
      popover: {
        title: 'Ver Detalles',
        description:
          'Haz clic en este botón para ver más información del registro.',
        position: 'bottom',
      },
    },
  ],
  cambaceoSemanal: [
    {
      element: '#contenedor',
      popover: {
        title: 'Cambaceo Semanal',
        description: 'Aquí puedes ver toda la información del registro.',
        position: 'bottom',
      },
    },
    {
      element: '.card',
      popover: {
        title: 'Registro',
        description: 'Este es un registro semanal con sus detalles.',
        position: 'bottom',
      },
    },
    {
      element: '.btnDiario',
      popover: {
        title: 'Ver Detalles',
        description:
          'Haz clic en este botón para ver más información del registro.',
        position: 'bottom',
      },
    },
  ],
  colabPruebaMaps: [
    {
      element: '#contenedor-cambaceo',
      popover: {
        title: 'Información del Registro',
        description: 'Aquí puedes ver toda la información del registro.',
        position: 'bottom',
      },
    },
    {
      element: '.btn-danger',
      popover: {
        title: 'Agregar Incidencia',
        description:
          'Si encuentras problemas, regístralos aquí como una incidencia.',
        position: 'top',
      },
    },
    {
      element: '.mapboxgl-map',
      popover: {
        title: 'Mapa de Ubicación',
        description:
          'Visualiza la ubicación del registro en el mapa interactivo.',
        position: 'right',
      },
    },
    {
      element: '#fecha-inicio',
      popover: {
        title: 'Fecha de Inicio',
        description:
          'Aquí se muestra la fecha de inicio de la actividad programada.',
        position: 'bottom',
      },
    },
    {
      element: '#horario',
      popover: {
        title: 'Horario',
        description: 'Consulta el horario programado de la actividad.',
        position: 'bottom',
      },
    },
    {
      element: '.btn-exportar',
      popover: {
        title: 'Abrir en Google Maps',
        description: 'Haz clic aquí para abrir la ubicación en Google Maps.',
        position: 'top',
      },
    },
  ],
};

// Función para iniciar el tour según la vista actual y el rol del usuario
export const startTour = (viewName, role = 'colaborador') => {
  if (tourSteps[viewName]) {
    const steps =
      typeof tourSteps[viewName] === 'function'
        ? tourSteps[viewName](role)
        : tourSteps[viewName];

    const driverObj = driver({
      showProgress: true,
      steps,
      doneBtnText: 'Finalizar',
      closeBtnText: 'Cerrar',
      nextBtnText: 'Siguiente',
      prevBtnText: 'Anterior',
      showButtons: true,
      keyboardControl: true,
    });

    driverObj.drive();
  } else {
    console.warn(`No hay pasos definidos para la vista: ${viewName}`);
  }
};
