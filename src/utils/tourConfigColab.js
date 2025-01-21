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
        element: '#btn-planeador',
        popover: {
          title: 'Planeador',
          description: 'Accede al planeador para gestionar tus actividades.',
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
    });

    driverObj.drive();
  } else {
    console.warn(`No hay pasos definidos para la vista: ${viewName}`);
  }
};
