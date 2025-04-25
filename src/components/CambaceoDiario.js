import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Map, { Marker, NavigationControl } from 'react-map-gl';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import 'mapbox-gl/dist/mapbox-gl.css';
import 'primeicons/primeicons.css'; //iconos
import { MultiSelect } from 'primereact/multiselect';
import { Button } from 'primereact/button';
import { ListBox } from 'primereact/listbox';
import { Form, Row, Col } from 'react-bootstrap';
import { ArrowLeft } from 'react-bootstrap-icons';
import Navbar from './navbar';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Calendar } from 'primereact/calendar';
import '../theme.css';
import 'primereact/resources/primereact.css'; // core css
import { CalendarioEsp } from '../utils/calendarLocale';
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';
import { fetchWithToken } from '../utils/api';
import { API_URL } from '../utils/api';
import { SessionManager } from '../utils/sessionManager';
import { startTour } from '../utils/tourConfigColab';

const mapboxToken = process.env.REACT_APP_MAPBOX_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapboxToken });

function CambaceoDiario() {
  CalendarioEsp();
  const navigate = useNavigate();
  const role = SessionManager.getRole();
  const [address, setAddress] = useState('');
  const [coordinates, setCoordinates] = useState({
    latitude: 26.084241,
    longitude: -98.303863,
  });
  const [viewState, setViewState] = useState({
    longitude: -98.303863,
    latitude: 26.084241,
    zoom: 16,
  });

  const [suggestions, setSuggestions] = useState([]);
  // Función asíncrona para geocodificación
  const fetchGeocoding = async (address) => {
    try {
      const response = await geocodingClient
        .forwardGeocode({
          query: address,
          limit: 5,
          language: ['es'],
        })
        .send();

      const matches = response.body.features;
      setSuggestions(matches);
    } catch (error) {
      console.error('Error en la geocodificación', error);
      setSuggestions([]);
    }
  };

  // Uso de useEffect para llamar a la función
  useEffect(() => {
    if (address.length > 0) {
      fetchGeocoding(address);
    } else {
      setSuggestions([]);
    }
  }, [address]);
  const handleSelect = (feature) => {
    setAddress(feature.place_name);
    setCoordinates({
      latitude: feature.center[1],
      longitude: feature.center[0],
    });
    setViewState({
      longitude: feature.center[0],
      latitude: feature.center[1],
      zoom: viewState.zoom,
    });
    setSuggestions([]);
    setIsFocused(false);
  };

  const listboxSuggestions = suggestions.map((suggestion) => ({
    label: suggestion.place_name,
    value: suggestion,
  }));
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };
  const handleBlur = () => {
    setTimeout(() => {
      if (!address.trim()) {
        setIsFocused(false);
      }
    }, 200);
  };
  const onMarkerDragEnd = async (event) => {
    const newCoords = {
      longitude: event.lngLat.lng,
      latitude: event.lngLat.lat,
    };

    setCoordinates({ ...coordinates, ...newCoords });

    // Realizar geocodificación inversa
    try {
      const response = await geocodingClient
        .reverseGeocode({
          query: [newCoords.longitude, newCoords.latitude],
          limit: 1,
        })
        .send();

      if (response && response.body && response.body.features.length > 0) {
        setAddress(response.body.features[0].place_name);
      }
    } catch (error) {
      console.error('Error al obtener la dirección', error);
    }
  };

  const [fechaInicio, setfechaInicio] = useState(null);
  const [horaInicio, sethoraInicio] = useState(null);
  const [horaFin, sethoraFin] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [colaboradores, setColaboradores] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [colaboradoresSeleccionados, setColaboradoresSeleccionados] = useState(
    []
  );
  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };
  const clearAddress = () => {
    setAddress('');
  };

  useEffect(() => {
    const fetchTeamMembers = async () => {
      const teamIds = [1, 35]; // IDs de los equipos
      const teamData = {
        equipoIds: teamIds,
      };

      const teamConfig = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(teamData),
      };

      try {
        const res = await fetchWithToken(
          `${API_URL}/usuariosPorEquipo`,
          teamConfig
        );
        const json = await res.json();
        console.log('Respuesta del servidor:', json);
      } catch (error) {
        console.error('Error al obtener los miembros del equipo:', error);
      }
    };

    fetchTeamMembers();
    startTour('colabPruebaMaps', role);
  }, []);

  const onSubmit = async (data) => {
    if (!data || !address || !fechaInicio) {
      Swal.fire({
        icon: 'error',
        title: 'Se requiere llenar el formulario',
        text: 'Completa todos los campos obligatorios',
        timer: 1200,
        timerProgressBar: true,
        backdrop: 'rgba(36,32,32,0.65)',
      });
      return;
    }
    try {
      console.log('Inicio: ' + fechaInicio);
      const fechaAsignacion = new Date(fechaInicio);
      if (horaInicio) {
        fechaAsignacion.setHours(horaInicio.getHours());
        fechaAsignacion.setMinutes(horaInicio.getMinutes());
      }
      const fechaConclusion = new Date(fechaInicio);
      if (horaFin) {
        fechaConclusion.setHours(horaFin.getHours());
        fechaConclusion.setMinutes(horaFin.getMinutes());
      }
      const FechaAsignacion = formateoFecha(fechaAsignacion);
      const FechaConclusion = formateoFecha(fechaConclusion);
      console.log('Hora inicio: ' + horaInicio);
      console.log('Hora fin: ' + horaFin);

      const tipoColaborador = [];
      const tipoEquipo = [];

      colaboradoresSeleccionados.forEach((item) => {
        const [id, nombreCompleto] = item.split('_');
        const colaborador = colaboradores.find(
          (col) => col.id === parseInt(id)
        );

        if (
          colaborador.tipo === 'Colaborador' ||
          colaborador.tipo === 'coordinador'
        ) {
          tipoColaborador.push(id);
        } else if (colaborador.tipo === 'Equipo') {
          tipoEquipo.push(id);
        }
      });

      let userIdsFromTeams = [];
      if (tipoEquipo.length > 0) {
        const teamData = {
          equipoIds: tipoEquipo,
        };

        const teamConfig = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(teamData),
        };

        const teamRes = await fetchWithToken(
          `${API_URL}/usuariosPorEquipo`,
          teamConfig
        );
        const teamJson = await teamRes.json();

        userIdsFromTeams = teamJson.userIds.map((id) => id.toString());
      }

      // Combinar los IDs de colaboradores y los IDs obtenidos de los equipos
      const allUserIds = [...tipoColaborador, ...userIdsFromTeams];

      if (allUserIds.length > 0) {
        data = {
          ...data,
          FechaAsignacion: FechaAsignacion,
          FechaConclusion: FechaConclusion,
          Direccion: address,
          idUsuarios: allUserIds,
          Activo: 1,
          Tipo: 'Cambaceo_Diario',
          Documentos: 'src',
          SitioWeb: 'src',
          TipoEmpresa: 'src',
        };

        let config = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        };
        try {
          Swal.fire({
            title: 'Cargando...',
            text: 'Por favor espera un momento',
            allowOutsideClick: false,
          });
          Swal.showLoading();
          let res = await fetchWithToken(`${API_URL}/createCambaceo`, config);
          const data = await res.json();
          Swal.close();

          if (res.ok) {
            const idPlanificador = data.idPlanificador;
            console.log('idPlanificador: ', idPlanificador);

            // Enviar idPlanificador y tipoEquipo a /addCambaceoEquipo
            if (tipoEquipo.length > 0) {
              const addCambaceoEquipoData = {
                idPlanificador: idPlanificador,
                equipoIds: tipoEquipo,
              };

              const addCambaceoEquipoConfig = {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(addCambaceoEquipoData),
              };

              try {
                console.log('ya estoy en el try');
                let addRes = await fetchWithToken(
                  `${API_URL}/addPlanificadorEquipo`,
                  addCambaceoEquipoConfig
                );
                const addResJson = await addRes.json();
                console.log('Respuesta de addCambaceoEquipo: ', addResJson);

                if (!addRes.ok) {
                  throw new Error(
                    addResJson.message || 'Error al agregar equipos al cambaceo'
                  );
                }
              } catch (error) {
                console.log('Error en addCambaceoEquipo: ', error);
                Swal.fire({
                  icon: 'error',
                  title: 'Error al agregar equipos al cambaceo',
                  text: error.message || 'UDA',
                  timer: 1200,
                  timerProgressBar: true,
                  backdrop: `
                    rgba(36,32,32,0.65)
                  `,
                });
                return;
              }
            }
          }

          Swal.fire({
            icon: 'success',
            title: 'Se agregó tu cambaceo diario correctamente',
            text: 'UDA',
            timer: 1200,
            timerProgressBar: true,
            backdrop: `
            rgba(36,32,32,0.65)
            
          `,
          }).then(() => {
            navigate('/Cambaceo');
          });
        } catch (error) {
          console.log(error);
          return Swal.fire({
            icon: 'error',
            title: 'Se produjo un error',
            text: 'UDA',
            timer: 1200,
            timerProgressBar: true,
            backdrop: `
            rgba(36,32,32,0.65)
            
          `,
          });
        }
      }
    } catch (error) {
      console.log('Error al enviar los datos al servidor:', error);
      return Swal.fire({
        icon: 'error',
        title: 'Se requiere llenar el formulario',
        text: 'UDA',
        timer: 1200,
        timerProgressBar: true,
        backdrop: `
        rgba(36,32,32,0.65)
      `,
      });
    }
  };

  const handleColaboradoresChange = (e) => {
    const seleccionados = e.value;
    const deseleccionados = colaboradoresSeleccionados.filter(
      (item) => !seleccionados.includes(item)
    );
    setColaboradoresSeleccionados(seleccionados);

    // Manejo de deseleccionados
    deseleccionados.forEach(async (item) => {
      const [id, nombreCompleto] = item.split('_');
      const colaborador = colaboradores.find((col) => col.id === parseInt(id));

      if (colaborador.tipo === 'Asesor' || colaborador.tipo === 'Coordinador') {
        try {
          const res = await fetchWithToken(
            `${API_URL}/equipoPorColaborador/${id}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
          const data = await res.json();

          if (data.id) {
            const updatedColaboradores = colaboradores.map((colab) => {
              if (colab.tipo === 'Equipo' && colab.id === data.id) {
                return { ...colab, disabled: false };
              }
              return colab;
            });
            setColaboradores(updatedColaboradores);
          }
        } catch (error) {
          console.error('Error al obtener el equipo del colaborador:', error);
        }
      } else if (colaborador.tipo === 'Equipo') {
        try {
          const res = await fetchWithToken(
            `${API_URL}/colaboradoresPorEquipo/${id}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
          const data = await res.json();

          if (data.length > 0) {
            const updatedColaboradores = colaboradores.map((colab) => {
              if (
                (colab.tipo === 'Asesor' || colab.tipo === 'Coordinador') &&
                data.some((equipoColab) => equipoColab.id === colab.id)
              ) {
                return { ...colab, disabled: false };
              }
              return colab;
            });
            setColaboradores(updatedColaboradores);
          }
        } catch (error) {
          console.error('Error al obtener los asesores del equipo:', error);
        }
      }
    });

    // Manejo de seleccionados
    const colaboradorIds = seleccionados.map((item) => item.split('_')[0]);

    colaboradorIds.forEach(async (id) => {
      const colaborador = colaboradores.find((col) => col.id === parseInt(id));

      if (colaborador.tipo === 'Asesor' || colaborador.tipo === 'Coordinador') {
        try {
          const res = await fetchWithToken(
            `${API_URL}/equipoPorColaborador/${id}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
          const data = await res.json();

          if (data.id) {
            const updatedColaboradores = colaboradores.map((colab) => {
              if (colab.tipo === 'Equipo' && colab.id === data.id) {
                return { ...colab, disabled: true };
              }
              return colab;
            });
            setColaboradores(updatedColaboradores);
          }
        } catch (error) {
          console.error('Error al obtener el equipo del colaborador:', error);
        }
      } else if (colaborador.tipo === 'Equipo') {
        try {
          const res = await fetchWithToken(
            `${API_URL}/colaboradoresPorEquipo/${id}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
          const data = await res.json();

          if (data.length > 0) {
            const updatedColaboradores = colaboradores.map((colab) => {
              if (
                (colab.tipo === 'Asesor' || colab.tipo === 'Coordinador') &&
                data.some((equipoColab) => equipoColab.id === colab.id)
              ) {
                return { ...colab, disabled: true };
              }
              return colab;
            });
            setColaboradores(updatedColaboradores);
          }
        } catch (error) {
          console.error(
            'Error al obtener los colaboradores del equipo:',
            error
          );
        }
      }
    });

    console.log('Colaboradores seleccionados:', seleccionados);
  };
  const cargarColaboradores = async () => {
    try {
      const response = await fetchWithToken(`${API_URL}/nombresColaborador2`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      console.log('esta es la data ', data);

      // Procesar colaboradores
      const colaboradoresProcesados = data.colaboradores
        .filter((colaborador) => colaborador.Rol !== 'gerente')
        .map((colaborador) => ({
          id: colaborador.idUsuario,
          nombreCompleto: `${colaborador.Nombre} ${colaborador.Apellido_pat} ${colaborador.Apellido_mat}`,
          tipo: colaborador.Rol === 'colaborador' ? 'Asesor' : colaborador.Rol,
        }));

      // Procesar equipos
      const equiposProcesados = data.equipos.map((equipo) => ({
        id: equipo.IDEquipo, // Asegúrate de que esto coincide con el campo en la respuesta de la API
        nombreEquipo: equipo.Nombre,
        tipo: 'Equipo',
      }));

      // Combinar colaboradores y equipos
      const combinados = [
        ...colaboradoresProcesados,
        ...equiposProcesados.map((equipo) => ({
          id: equipo.id,
          nombreCompleto: equipo.nombreEquipo,
          tipo: equipo.tipo,
        })),
      ];

      console.log('Combinados: ', combinados);

      // Actualizar estado
      setColaboradores(combinados);
    } catch (error) {
      console.error(
        'Error al cargar nombres de colaboradores y equipos:',
        error
      );
    }
  };

  useEffect(() => {
    cargarColaboradores();
  }, []);
  const getLabelStyle = (tipo) => {
    return {
      color: tipo === 'Colaborador' ? 'green' : 'blue',
    };
  };
  const opcionesColaboradores = colaboradores.map((colaborador) => ({
    label: `${colaborador.nombreCompleto} (${colaborador.tipo})`,
    value: `${colaborador.id}_${colaborador.nombreCompleto}`,
    disabled: colaborador.disabled || false, // Agregar estado de deshabilitado
  }));

  const panelFooterTemplate = () => {
    const length = colaboradoresSeleccionados
      ? colaboradoresSeleccionados.length
      : 0;

    return (
      <div className='py-2 px-3'>
        {length === 0 ? (
          <>
            <b>Ningún</b> asesor seleccionado
          </>
        ) : (
          <>
            <b>{length}</b> asesor{length > 1 ? 'es' : ''} seleccionado
            {length > 1 ? 's' : ''}.
          </>
        )}
      </div>
    );
  };
  const formateoFecha = (fechaI) => {
    const year = fechaI.getFullYear();
    const month = ('0' + (fechaI.getMonth() + 1)).slice(-2);
    const day = ('0' + fechaI.getDate()).slice(-2);
    const hours = ('0' + fechaI.getHours()).slice(-2);
    const minutes = ('0' + fechaI.getMinutes()).slice(-2);
    const seconds = ('0' + fechaI.getSeconds()).slice(-2);
    const FechaNueva = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return FechaNueva;
  };

  return (
    <div className='fluid'>
      <Navbar style={{ backgroundColor: '##F8F9FA' }}></Navbar>

      <div style={{ backgroundColor: '#F1F5F8' }}>
        <div
          style={{
            paddingTop: '10px',
            paddingBottom: '10px',
            backgroundColor: '#F1F5F8',
          }}
        >
          <Link to='/Cambaceo'>
            <ArrowLeft className='ml-4 regreso' />
            <span style={{ marginBottom: '100px' }} id='indicador'>
              Menu Cambaceo
            </span>
          </Link>
        </div>
      </div>

      <div
        className='py-md-4'
        style={{ backgroundColor: '#F1F5F8', padding: '1.5rem 0' }}
      >
        <div className='col-12 px-5'>
          <h2 className='titulo-cambaceo px-5 '>Cambaceo Diario</h2>
        </div>

        <div
          className='container-fluid mt-md-2 mb-md-5 p-md-5 p-3 mb-4 mt-4'
          id='contenedor-cambaceo'
        >
          <Form onSubmit={handleSubmit(onSubmit)} className='mt-2 mt-md-0'>
            <Row className='mb-2'>
              <Col xs={12} md={6}>
                <div id='asignarUserTour'>
                  <Form.Group>
                    <h5 style={{ textAlign: 'left' }}>Asesores </h5>
                    <MultiSelect
                      value={colaboradoresSeleccionados}
                      options={opcionesColaboradores}
                      onChange={handleColaboradoresChange}
                      panelFooterTemplate={panelFooterTemplate}
                      placeholder='Selecciona usuarios o equipos'
                      display='chip'
                      style={{ width: '100%' }}
                      filter
                    />
                  </Form.Group>
                </div>
                <div style={{ marginTop: '15px' }} id='direccionTour'>
                  <Form.Group>
                    <h5 style={{ textAlign: 'left' }}>Dirección</h5>
                    <span
                      className='p-input-icon-right'
                      style={{ width: '100%' }}
                    >
                      {address && (
                        <i
                          className='pi pi-times cursor-pointer'
                          onClick={clearAddress}
                        />
                      )}
                      <InputText
                        value={address}
                        onChange={handleAddressChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        placeholder='Buscar dirección...'
                        className='p-inputtext-sm p-d-block p-mb-2'
                        style={{ width: '100%' }}
                      />
                    </span>
                    {isFocused && suggestions.length > 0 && (
                      <ListBox
                        options={listboxSuggestions}
                        onChange={(e) => handleSelect(e.value)}
                        optionLabel='label'
                        style={{ width: '100%' }}
                      />
                    )}
                  </Form.Group>
                </div>
                <div style={{ marginTop: '15px' }}>
                  <Form.Group>
                    <h5 style={{ textAlign: 'left' }}>Descripcion</h5>
                    <InputTextarea
                      autoResize
                      rows={4}
                      cols={30}
                      placeholder='Descripcion de la actividad diaria'
                      {...register('Descripcion', {
                        required: 'La descripción es obligatoria',
                      })}
                      style={{ width: '100%' }}
                    />
                    {errors.Descripcion && (
                      <small className='p-error'>
                        {errors.Descripcion.message}
                      </small>
                    )}
                  </Form.Group>
                </div>
                <div style={{ marginTop: '15px' }} id='fecha-inicio'>
                  <Row>
                    <Col>
                      <Form.Group>
                        <h6 style={{ textAlign: 'left' }}>Fecha Inicio</h6>
                        <Calendar
                          id='calendar-24h-inicio'
                          value={fechaInicio}
                          onChange={(e) => setfechaInicio(e.value)}
                          touchUI
                          placeholder='Ingresa la fecha'
                          locale='es'
                          dateFormat='dd/mm/yy'
                          className='custom-calendar'
                          showIcon
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </div>
                <div style={{ marginTop: '15px' }} id='horario'>
                  <Row>
                    <Col>
                      <Form.Group>
                        <h6 style={{ textAlign: 'left' }}>Horario</h6>
                        <div className='row'>
                          <div className='col-md-6'>
                            <Calendar
                              id='calendar-24h-fin'
                              value={horaInicio}
                              className='custom-calendar'
                              onChange={(e) => {
                                sethoraInicio(e.value);
                                const horaFinNueva = new Date(
                                  e.value.getTime() + 60000
                                );
                                sethoraFin(horaFinNueva);
                              }}
                              timeOnly
                              hourFormat='24'
                              dateFormat='dd/mm/yy'
                              locale='es'
                              placeholder='Hora Inicio'
                              showIcon
                            />
                          </div>
                          <div className='col-md-6 mt-3 mt-md-0'>
                            <Calendar
                              id='calendar-24h-fin'
                              value={horaFin}
                              className='custom-calendar'
                              onChange={(e) => sethoraFin(e.value)}
                              timeOnly
                              hourFormat='24'
                              dateFormat='dd/mm/yy'
                              locale='es'
                              showIcon
                              placeholder='Hora Fin'
                              minDate={
                                horaInicio
                                  ? new Date(horaInicio.getTime() + 60000)
                                  : null
                              }
                            />
                          </div>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                </div>
              </Col>
              <Col xs={12} md={6} className='mt-4 mt-md-0'>
                <Map
                  {...viewState}
                  onMove={(evt) => setViewState(evt.viewState)}
                  style={{
                    width: '100%',
                    height: '480px',
                    borderRadius: '8px',
                  }}
                  mapStyle='mapbox://styles/mapbox/streets-v11'
                  onStyleLoad={(map) => {
                    map.setLayoutProperty('country-label', 'text-field', [
                      'get',
                      'name_es',
                    ]);
                  }}
                  mapboxAccessToken={mapboxToken}
                >
                  <Marker
                    longitude={coordinates.longitude}
                    latitude={coordinates.latitude}
                    draggable
                    onDragEnd={onMarkerDragEnd}
                  />
                  <NavigationControl position='top-right' />
                </Map>
                <Row>
                  <div style={{ marginTop: '20px' }}>
                    <Button
                      type='submit'
                      value='Enviar'
                      style={{ float: 'right', borderRadius: '20px' }}
                      variant='outline-danger'
                      size='lg'
                    >
                      Agregar
                    </Button>
                  </div>
                </Row>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </div>
  );
}
export default CambaceoDiario;
