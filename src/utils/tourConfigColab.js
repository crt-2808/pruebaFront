import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { API_URL, fetchWithToken } from '../utils/api';
import { SessionManager } from '../utils/sessionManager';

// Función para marcar el tour como visto en la base de datos
const marcarTourComoVisto = async () => {
  try {
    console.log('Marcando tour como visto');
    await fetchWithToken(`${API_URL}/marcarTourVisto`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    });
    SessionManager.setVistoTour(1);
  } catch (error) {
    console.error('Error marcando tour como visto:', error);
  }
};

// ✅ Función que se ejecuta cuando el tour finaliza en una vista
const handleTourCompletion = async (viewName) => {
  console.log(`Tour de ${viewName} finalizado, marcando como visto.`);
  SessionManager.addVistaTour(viewName);

  // ✅ Lista de vistas que el usuario debe completar antes de marcar el tour como visto en la BD
  const vistasRequeridas = [
    'land',
    'planeador',
    'cambaceoDiario',
    'cambaceoSemanal',
  ];

  const vistasCompletadas = SessionManager.getVistasTour();
  if (vistasRequeridas.every((vista) => vistasCompletadas.includes(vista))) {
    console.log(
      'El usuario ha completado todos los tours, marcando como visto en la BD.'
    );
    await marcarTourComoVisto();
  }
};

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
        element: '.btn-planeador-tour',
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

    if (role === 'admin') {
      steps.push(
        {
          element: '#tourUser',
          popover: {
            title: 'Usuarios',
            description: 'Agrega o edita usuarios.',
            position: 'top',
          },
        },
        {
          element: '.verEquipos',
          popover: {
            title: 'Equipos',
            description: 'Accede y gestiona tus equipos.',
            position: 'top',
          },
        },
        {
          element: '.todosUsuarios',
          popover: {
            title: 'Todos los usuarios',
            description:
              'Accede a la página de todos los usuarios y a quien esta asigando.',
            position: 'top',
          },
        }
      );
    }

    if (role === 'colaborador') {
      steps.push(
        {
          element: '.btn-exportar',
          popover: {
            title: 'Agregar Incidencias',
            description:
              'Haz clic aquí para registrar tus actividades diarias.',
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
        }
      );
    }

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
  planeador: (role) => {
    const steps = [
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
    ];
    return steps;
  },
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
  colabPruebaMaps: (role) => {
    const steps = [
      {
        element: '#contenedor-cambaceo',
        popover: {
          title: 'Información del Registro',
          description: 'Aquí puedes ver toda la información del registro.',
          position: 'bottom',
        },
      },
    ];
    if (role === 'admin' || role === 'lider') {
      steps.push(
        {
          element: '#asignarUserTour',
          popover: {
            title: 'Asignar Usuarios',
            description:
              'Aquí puedes asignar tanto uusuarios como equipos a la actividad.',
            position: 'bottom',
          },
        },
        {
          element: '#direccionTour',
          popover: {
            title: 'Dirección',
            description:
              'Aquí puedes buscar o confirmar la dirección del registro.',
            position: 'bottom',
          },
        },
        {
          element: '.mapboxgl-map',
          popover: {
            title: 'Mapa de Ubicación',
            description:
              'Visualiza la ubicación del registro en el mapa interactivo. Puedes agregar la direccion manualmente o arrastrar el marcador para confirmarla.',
            position: 'right',
          },
        },
        {
          element: '#fecha-inicio',
          popover: {
            title: 'Fecha de Inicio',
            description:
              'Aquí puedes asignar la fecha de inicio de la actividad programada.',
            position: 'bottom',
          },
        },
        {
          element: '#horario',
          popover: {
            title: 'Horario',
            description: 'Asigna el horario programado de la actividad.',
            position: 'bottom',
          },
        }
      );
    }

    if (role === 'colaborador') {
      steps.push(
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
            description:
              'Haz clic aquí para abrir la ubicación en Google Maps.',
            position: 'top',
          },
        }
      );
    }
    return steps;
  },
  createdSemanal: (role) => {
    const steps = [
      {
        element: '#contenedor-cambaceo',
        popover: {
          title: 'Información del Registro',
          description: 'Aquí puedes ver toda la información del registro.',
          position: 'bottom',
        },
      },
    ];
    if (role === 'admin' || role === 'lider') {
      steps.push(
        {
          element: '#asignarUserTour',
          popover: {
            title: 'Asignar Usuarios',
            description:
              'Aquí puedes asignar tanto uusuarios como equipos a la actividad.',
            position: 'bottom',
          },
        },
        {
          element: '#direccionTour',
          popover: {
            title: 'Dirección',
            description:
              'Aquí puedes buscar o confirmar la dirección del registro.',
            position: 'bottom',
          },
        },
        {
          element: '.mapboxgl-map',
          popover: {
            title: 'Mapa de Ubicación',
            description:
              'Visualiza la ubicación del registro en el mapa interactivo. Puedes agregar la direccion manualmente o arrastrar el marcador para confirmarla.',
            position: 'right',
          },
        },
        {
          element: '#fecha-inicio',
          popover: {
            title: 'Fecha de Inicio',
            description:
              'Aquí puedes asignar la fecha de inicio de la actividad programada.',
            position: 'bottom',
          },
        },
        {
          element: '#fecha-fin',
          popover: {
            title: 'Fecha de Fin',
            description:
              'Aquí puedes asignar la fecha de fin de la actividad programada.',
            position: 'bottom',
          },
        }
      );
    }
    return steps;
  },
  trackCambaceo: (role) => {
    const steps = [
      {
        element: '#contenedor-cambaceo',
        popover: {
          title: 'Información del Registro',
          description: 'Aquí puedes ver toda la información del registro.',
          position: 'bottom',
        },
        position: 'top',
      },
    ];
    if (role === 'admin' || role === 'lider') {
      steps.push(
        {
          element: '#buscarUsuario',
          popover: {
            title: 'Buscar Usuario',
            description:
              'Aquí puedes buscar un usuario específico para ver su actividad.',
            position: 'bottom',
          },
        },
        {
          element: '.cambaceoCard',
          popover: {
            title: 'Cambaceo',
            description: 'Aquí puedes ver toda la información del registro.',
            position: 'bottom',
          },
        },
        {
          element: '.cambaceoCardTitle',
          popover: {
            title: 'Tipo de Registro',
            description:
              'Aquí puedes ver el tipo de registro que se está mostrando.',
            position: 'bottom',
          },
        },
        {
          element: '.cambaceoCardDate',
          popover: {
            title: 'Fecha de Inicio',
            description: 'Aquí puedes ver la fecha de inicio del registro.',
            position: 'bottom',
          },
        },
        {
          element: '.cambaceoCardAvatars',
          popover: {
            title: 'Colaboradores',
            description:
              'Aquí puedes ver todos los colaboradores que asignaron el registro.',
            position: 'bottom',
          },
        },
        {
          element: '.cambaceoCardBtn',
          popover: {
            title: 'Ver Detalles',
            description: 'Haz clic aquí para ver más información del registro.',
            position: 'bottom',
          },
        }
      );
    }
    return steps;
  },
  createdVisita: (role) => {
    const steps = [
      {
        element: '#contenedor-cambaceo',
        popover: {
          title: 'Información del Registro',
          description: 'Aquí puedes ver toda la información del registro.',
          position: 'bottom',
        },
      },
    ];
    if (role === 'admin' || role === 'lider') {
      steps.push(
        {
          element: '#users-tour',
          popover: {
            title: 'Usuarios',
            description:
              'Aquí puedes asignar tanto usuarios como equipos a la actividad.',
            position: 'bottom',
          },
        },
        {
          element: '#phone-tour',
          popover: {
            title: 'Teléfono',
            description: 'Añade el teléfono un telefono',
            position: 'bottom',
          },
        },
        {
          element: '#date-tour',
          popover: {
            title: 'Fecha de Inicio',
            description:
              'Aquí puedes asignar la fecha de inicio de la actividad programada.',
            position: 'bottom',
          },
        },
        {
          element: '#address-tour',
          popover: {
            title: 'Dirección',
            description:
              'Aquí puedes buscar o confirmar la dirección del registro.',
            position: 'bottom',
          },
        },
        {
          element: '.mapboxgl-map',
          popover: {
            title: 'Mapa de Ubicación',
            description:
              'Visualiza la ubicación del registro en el mapa interactivo. Puedes agregar la direccion manualmente o arrastrar el marcador para confirmarla.',
            position: 'right',
          },
        },
        {
          element: '#description-tour',
          popover: {
            title: 'Descripción',
            description: 'Consulta la descripción del registro.',
            position: 'bottom',
          },
        }
      );
    }
    return steps;
  },
  trackVisita: (role) => {
    const steps = [
      {
        element: '#contenedor',
        popover: {
          title: 'Información del Registro',
          description: 'Aquí puedes ver toda la información del registro.',
          position: 'bottom',
        },
        position: 'top',
      },
    ];
    if (role === 'admin' || role === 'lider') {
      steps.push(
        {
          element: '#buscarUsuario',
          popover: {
            title: 'Buscar Usuario',
            description:
              'Aquí puedes buscar un usuario específico para ver su actividad.',
            position: 'bottom',
          },
        },
        {
          element: '.tour-card',
          popover: {
            title: 'Registro',
            description: 'Aquí puedes ver toda la información del registro.',
            position: 'bottom',
          },
        },
        {
          element: '.tour-card-title',
          popover: {
            title: 'Empresa',
            description:
              'Aquí puedes ver el nombre de la empresa del registro.',
            position: 'bottom',
          },
        },
        {
          element: '.tour-card-date',
          popover: {
            title: 'Fecha de Inicio',
            description: 'Aquí puedes ver la fecha de inicio del registro.',
            position: 'bottom',
          },
        },
        {
          element: '.tour-card-btn',
          popover: {
            title: 'Ver Detalles',
            description:
              'Haz clic en este botón para ver más información del registro.',
            position: 'bottom',
          },
        }
      );
    }
    return steps;
  },
  createdLlamada: (role) => {
    const steps = [
      {
        element: '#contenedor-cambaceo',
        popover: {
          title: 'Información del Registro',
          description: 'Aquí puedes ver toda la información del registro.',
          position: 'bottom',
        },
      },
    ];
    if (role === 'admin' || role === 'lider') {
      steps.push(
        {
          element: '#users-tour',
          popover: {
            title: 'Usuarios',
            description:
              'Aquí puedes asignar tanto usuarios como equipos a la actividad.',
            position: 'bottom',
          },
        },
        {
          element: '#phone-tour',
          popover: {
            title: 'Teléfono',
            description: 'Añade el teléfono un telefono',
            position: 'bottom',
          },
        },
        {
          element: '#date-tour',
          popover: {
            title: 'Fecha de Inicio',
            description:
              'Aquí puedes asignar la fecha de inicio de la actividad programada.',
            position: 'bottom',
          },
        }
      );
    }
    return steps;
  },
  trackLlamada: (role) => {
    const steps = [
      {
        element: '#contenedor',
        popover: {
          title: 'Información del Registro',
          description: 'Aquí puedes ver toda la información del registro.',
          position: 'bottom',
        },
        position: 'top',
      },
    ];
    if (role === 'admin' || role === 'lider') {
      steps.push(
        {
          element: '#buscarUsuario',
          popover: {
            title: 'Buscar Usuario',
            description:
              'Aquí puedes buscar un usuario específico para ver su actividad.',
            position: 'bottom',
          },
        },
        {
          element: '.tour-card',
          popover: {
            title: 'Registro',
            description: 'Aquí puedes ver toda la información del registro.',
            position: 'bottom',
          },
        },
        {
          element: '.tour-card-title',
          popover: {
            title: 'Usuario',
            description: 'Aquí puedes ver al usuario que asigna el registro.',
            position: 'bottom',
          },
        },
        {
          element: '.tour-card-date',
          popover: {
            title: 'Fecha de Inicio',
            description: 'Aquí puedes ver la fecha de inicio del registro.',
            position: 'bottom',
          },
        },
        {
          element: '.tour-phone',
          popover: {
            title: 'Teléfono',
            description: 'Aquí puedes ver el teléfono del usuario.',
            position: 'bottom',
          },
        },
        {
          element: '.tour-card-btn',
          popover: {
            title: 'Ver Detalles',
            description:
              'Haz clic en este botón para ver más información del registro.',
            position: 'bottom',
          },
        }
      );
    }
    return steps;
  },
  editUser: (role) => {
    const steps = [
      {
        element: '#tourUsersEdit',
        popover: {
          title: 'Información del Registro',
          description: 'Aquí puedes ver toda la información del registro.',
          position: 'bottom',
        },
      },
    ];
    if (role === 'admin' || role === 'lider') {
      steps.push(
        {
          element: '.tour-card',
          popover: {
            title: 'Usuarios',
            description:
              'Aquí puedes asignar tanto usuarios como equipos a la actividad.',
            position: 'bottom',
          },
        },
        {
          element: '.tour-card-name',
          popover: {
            title: 'Nombre',
            description: 'Aquí puedes ver el nombre del usuario.',
            position: 'bottom',
          },
        },
        {
          element: '.tour-card-role',
          popover: {
            title: 'Rol',
            description: 'Aquí puedes ver el rol del usuario.',
            position: 'bottom',
          },
        },
        {
          element: '.tour-card-email',
          popover: {
            title: 'Correo',
            description: 'Aquí puedes ver el correo del usuario.',
            position: 'bottom',
          },
        },
        {
          element: '.tour-card-phone',
          popover: {
            title: 'Teléfono',
            description: 'Aquí puedes ver el teléfono del usuario.',
            position: 'bottom',
          },
        },
        {
          element: '.tour-edit',
          popover: {
            title: 'Editar',
            description: 'Haz clic aquí para editar el usuario.',
            position: 'bottom',
          },
        },
        {
          element: '.tour-delete',
          popover: {
            title: 'Dar de baja',
            description: 'Haz clic aquí para dar de baja el usuario.',
            position: 'bottom',
          },
        }
      );
    }
    return steps;
  },
};

// Función para iniciar el tour según la vista actual y el rol del usuario
export const startTour = (viewName, role) => {
  // Verificar si el usuario ya ha visto el tour
  const yaVioTour = SessionManager.getVistoTour();
  console.log(yaVioTour);
  if (yaVioTour === '1') {
    console.log('Si ya vio el tour:', yaVioTour);
    return false;
  }
  if (yaVioTour === '0') {
    console.log('No lo ha visto');
  }

  const vistasVistas = SessionManager.getVistasTour();

  if (vistasVistas.includes(viewName)) {
    console.log(`El usuario ya vio el tour de ${viewName}, no se ejecuta.`);
    return false;
  }

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
      onDestroyed: () => handleTourCompletion(viewName),
    });

    driverObj.drive();
  } else {
    console.warn(`No hay pasos definidos para la vista: ${viewName}`);
  }
};
