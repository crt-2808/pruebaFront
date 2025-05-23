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

function CambaceoSemanal() {
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
  const [fechaFin, setfechaFin] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [colaboradores, setColaboradores] = useState([]);
  const [colaboradoresSeleccionados, setColaboradoresSeleccionados] = useState(
    []
  );
  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };
  const clearAddress = () => {
    setAddress('');
  };

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
      console.log(data);
      console.log('Inicio: ' + fechaInicio);
      const fechaAsignacion = new Date(fechaInicio);
      const fechaConclucion = new Date(fechaFin);
      const FechaAsignacion = formateoFecha(fechaAsignacion);
      const FechaConclucion = formateoFecha(fechaConclucion);

      const tipoColaborador = [];
      const tipoEquipo = [];

      colaboradoresSeleccionados.forEach((item) => {
        const [id, nombreCompleto] = item.split('_');
        const colaborador = colaboradores.find(
          (col) => col.id === parseInt(id)
        );

        if (colaborador.tipo === 'Colaborador') {
          tipoColaborador.push(id);
        } else if (colaborador.tipo === 'Equipo') {
          tipoEquipo.push(id);
        }
      });

      console.log('Colaboradores: ', tipoColaborador);
      console.log('Equipos: ', tipoEquipo);

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
          FechaConclusion: FechaConclucion,
          Direccion: address,
          idUsuarios: tipoColaborador,
          Activo: 1,
          Tipo: 'Cambaceo_Semanal',
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
          Swal.close();
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

      if (colaborador.tipo === 'Colaborador') {
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
            // Lógica para re-habilitar el equipo
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
            // Lógica para re-habilitar los colaboradores del equipo
            const updatedColaboradores = colaboradores.map((colab) => {
              if (
                colab.tipo === 'Colaborador' &&
                data.some((equipoColab) => equipoColab.id === colab.id)
              ) {
                return { ...colab, disabled: false };
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

    // Manejo de seleccionados
    const colaboradorIds = seleccionados.map((item) => item.split('_')[0]);

    colaboradorIds.forEach(async (id) => {
      const colaborador = colaboradores.find((col) => col.id === parseInt(id));

      if (colaborador.tipo === 'Colaborador') {
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

          if (
            data.message &&
            data.message === 'El colaborador no pertenece a ningún equipo'
          ) {
            // No hacer nada si el colaborador no pertenece a ningún equipo
            console.log(
              `El colaborador ${colaborador.nombreCompleto} no pertenece a ningún equipo`
            );
          } else if (data.id) {
            // Lógica para deshabilitar el equipo
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

          if (
            data.message &&
            data.message === 'El equipo no tiene colaboradores'
          ) {
            // No hacer nada si el equipo no tiene colaboradores
            console.log(
              `El equipo ${colaborador.nombreCompleto} no tiene colaboradores`
            );
          } else if (data.length > 0) {
            // Lógica para deshabilitar los colaboradores del equipo
            const updatedColaboradores = colaboradores.map((colab) => {
              if (
                colab.tipo === 'Colaborador' &&
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
      console.log(data);

      // Procesar colaboradores
      const colaboradoresProcesados = data.colaboradores.map((colaborador) => ({
        id: colaborador.idUsuario,
        nombreCompleto: `${colaborador.Nombre} ${colaborador.Apellido_pat} ${colaborador.Apellido_mat}`,
        tipo: 'Colaborador',
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
  useEffect(() => {
    startTour('createdSemanal', role);
  }, [role]);

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
          <h2 className='titulo-cambaceo px-5 '>Cambaceo Semanal</h2>
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
                    <h5 style={{ textAlign: 'left' }}>Asesores</h5>
                    <MultiSelect
                      value={colaboradoresSeleccionados}
                      options={opcionesColaboradores}
                      onChange={handleColaboradoresChange}
                      panelFooterTemplate={panelFooterTemplate}
                      placeholder='Selecciona asesores'
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
                          showTime
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
                <div style={{ marginTop: '15px' }} id='fecha-fin'>
                  <Row>
                    <Col>
                      <Form.Group>
                        <h6 style={{ textAlign: 'left' }}>Fecha Fin</h6>
                        <Calendar
                          id='calendar-24h-fin'
                          value={fechaFin}
                          className='custom-calendar'
                          onChange={(e) => setfechaFin(e.value)}
                          showTime
                          hourFormat='24'
                          placeholder='Fecha Fin'
                          dateFormat='dd/mm/yy'
                          locale='es'
                          minDate={
                            fechaInicio
                              ? new Date(fechaInicio.getTime() + 60000)
                              : null
                          }
                          showIcon
                        />
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
export default CambaceoSemanal;
