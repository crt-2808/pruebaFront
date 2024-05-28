import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { InputTextarea } from 'primereact/inputtextarea';
import { MultiSelect } from 'primereact/multiselect';
import { InputMask } from 'primereact/inputmask';
import 'mapbox-gl/dist/mapbox-gl.css';
import 'primeicons/primeicons.css'; //iconos
import Map, { Marker, NavigationControl } from 'react-map-gl';
import Swal from 'sweetalert2';
import Navbar from './navbar';
import { formatearFecha } from '../utils/utils';
import { ArrowLeft } from 'react-bootstrap-icons';
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import { useAuthRedirect } from '../useAuthRedirect';
import { CalendarioEsp } from '../utils/calendarLocale';
import { API_URL, fetchWithToken } from '../utils/api';
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';
import { ListBox } from 'primereact/listbox';

function CalendarioVisita() {
  useAuthRedirect();
  CalendarioEsp();
  const mapboxToken = process.env.REACT_APP_MAPBOX_TOKEN;
  const geocodingClient = mbxGeocoding({ accessToken: mapboxToken });
  const navigate = useNavigate();
  const [Telefono, setTelefono] = useState('');
  const [FechaAsignacion, setFecha] = useState(null);
  const [TipoEmpresa, setTipoEmpresa] = useState('');
  const [Sitioweb, setSitioweb] = useState('');
  const [Descripcion, setDescripcion] = useState('');
  const [colaboradores, setColaboradores] = useState([]);
  const [colaboradoresSeleccionados, setColaboradoresSeleccionados] = useState(
    []
  );
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
  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };
  const clearAddress = () => {
    setAddress('');
  };
  useEffect(() => {
    cargarColaboradores();
  }, []);

  const handleSubmit = () => {
    // Aquí puedes enviar los datos a la base de datos MySQL utilizando Axios u otra biblioteca de HTTP.
    // Por ejemplo, puedes enviarlos a una API REST.
    const fechaAsignacionFormateada = formatearFecha(FechaAsignacion);
    const idsUsuariosSeleccionados = colaboradoresSeleccionados.map(
      (colaboradorSeleccionado) => {
        const [id] = colaboradorSeleccionado.split('_');
        return id;
      }
    );
    const data = {
      Telefono,
      FechaAsignacion: fechaAsignacionFormateada,
      TipoEmpresa,
      Sitioweb,
      Direccion: address,
      Descripcion,
      idUsuarios: idsUsuariosSeleccionados,
    };
    console.log(data);
    fetchWithToken(`${API_URL}/crearVisitaProgramada`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        // Muestra una alerta de éxito
        console.log(response);
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Los datos se han registrado correctamente',
          timer: 1200,
          timerProgressBar: true,
          backdrop: `
        rgba(36,32,32,0.65)
        
      `,
        }).then(() => {
          navigate('/VisitaProgramada');
        });
      })
      .catch((error) => {
        // Muestra una alerta de error
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al registrar los datos',
          timer: 1200,
          timerProgressBar: true,
          backdrop: `
        rgba(36,32,32,0.65)
        
      `,
        });
        console.error('Error al enviar los datos al servidor:', error);
      });
  };
  const obtenerFechaHoraActual = () => {
    const ahora = new Date();
    const opciones = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
    return ahora
      .toLocaleString('en-US', opciones)
      .replace(/(\d+)\/(\d+)\/(\d+),/, '$2/$1/$3');
  };

  const handleColaboradoresChange = (e) => {
    setColaboradoresSeleccionados(e.value);
    console.log('Colaboradores seleccionados:', e.value);
  };
  const cargarColaboradores = async () => {
    try {
      const response = await fetchWithToken(`${API_URL}/nombresColaborador`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      const colaboradoresProcesados = data.map((colaborador) => ({
        id: colaborador.idUsuario,
        nombreCompleto: `${colaborador.Nombre} ${colaborador.Apellido_pat} ${colaborador.Apellido_mat}`,
      }));

      console.log('Colaboradores: ', colaboradoresProcesados);
      setColaboradores(colaboradoresProcesados);
    } catch (error) {
      console.error('Error al cargar nombres de colaboradores:', error);
    }
  };
  useEffect(() => {
    cargarColaboradores();
  }, []);
  const opcionesColaboradores = colaboradores.map((colaborador) => ({
    label: colaborador.nombreCompleto,
    value: `${colaborador.id}_${colaborador.nombreCompleto}`,
  }));
  const panelFooterTemplate = () => {
    const length = colaboradoresSeleccionados
      ? colaboradoresSeleccionados.length
      : 0;

    return (
      <div className='py-2 px-3'>
        {length === 0 ? (
          <>
            <b>Ningún</b> colaborador seleccionado
          </>
        ) : (
          <>
            <b>{length}</b> colaborador{length > 1 ? 'es' : ''} seleccionado
            {length > 1 ? 's' : ''}.
          </>
        )}
      </div>
    );
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
          <Link to='/VisitaProgramada'>
            <ArrowLeft className='ml-4 regreso' />
            <span style={{ marginBottom: '100px' }} id='indicador'>
              Menu Visita
            </span>
          </Link>
        </div>
      </div>
      <div className='py-md-4 py-3' style={{ backgroundColor: '#F1F5F8' }}>
        <div
          className='row'
          style={{
            marginLeft: '35px',
            marginBottom: '-50px',
            marginRight: '0px',
          }}
        >
          <h2 className='titulo-cambaceo px-0 px-md-5 '>Agregar Visita</h2>
        </div>

        <div
          className='container-fluid mt-md-5 mb-md-5 p-md-5 p-3 mb-4 mt-5 mt-md-4'
          id='contenedor-cambaceo'
          style={{ marginBottom: '0px' }}
        >
          <Row className='mb-5'>
            <Col xs={12} md={6}>
              <div className='p-field'>
                <label htmlFor='NombreCompleto'>
                  Colaboradores
                  <br />
                </label>
              </div>
              <div>
                <MultiSelect
                  value={colaboradoresSeleccionados}
                  options={opcionesColaboradores}
                  onChange={handleColaboradoresChange}
                  panelFooterTemplate={panelFooterTemplate}
                  placeholder='Selecciona colaboradores'
                  display='chip'
                  style={{ width: '100%' }}
                  filter
                />
              </div>
              <div className='p-field'>
                <label htmlFor='Telefono'>Teléfono</label>
              </div>
              <div>
                <InputMask
                  id='Telefono'
                  value={Telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  mask='(99) 9999 9999'
                  unmask={true}
                  placeholder='(55) 6789 5432'
                  style={{ width: '100%' }}
                />
              </div>
              <div className='p-field'>
                <label htmlFor='FechaAsignacion'>Fecha y Hora</label>
              </div>
              <div>
                <Calendar
                  id='FechaAsignacion'
                  value={FechaAsignacion}
                  onChange={(e) => setFecha(e.value)}
                  showIcon
                  showTime
                  hourFormat='12'
                  dateFormat='dd/mm/yy'
                  placeholder={obtenerFechaHoraActual()}
                  style={{ width: '100%' }}
                  locale='es'
                />
              </div>
              <div className='p-field'>
                <label htmlFor='Direccion'>
                  Dirección
                  <br />
                </label>
              </div>
              <div>
                <span className='p-input-icon-right' style={{ width: '100%' }}>
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
              </div>
            </Col>
            <Col xs={12} md={6}>
              <div className='p-field'>
                <label htmlFor='TipoEmpresa'>
                  Empresa
                  <br />
                </label>
              </div>
              <div>
                <InputText
                  id='TipoEmpresa'
                  value={TipoEmpresa}
                  onChange={(e) => setTipoEmpresa(e.target.value)}
                  style={{ width: '100%' }}
                  placeholder='Tech Solutions'
                />
              </div>

              <div className='p-field'>
                <label htmlFor='Sitioweb'>
                  Sitio Web
                  <br />
                </label>
              </div>
              <div>
                <InputText
                  id='Sitioweb'
                  value={Sitioweb}
                  onChange={(e) => setSitioweb(e.target.value)}
                  style={{ width: '100%' }}
                  placeholder='https://www.ejemplo.com'
                />
              </div>

              <div className='p-field'>
                <label htmlFor='Descripcion'>Descripción</label>
              </div>
              <div>
                <InputTextarea
                  id='Descripcion'
                  autoResize
                  value={Descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  rows={5}
                  style={{ width: '100%' }}
                  placeholder='Describe brevemente el propósito de la visita...'
                />
              </div>
            </Col>
            <Col xs={12} md={12} className='centrar'>
              <Map
                {...viewState}
                onMove={(evt) => setViewState(evt.viewState)}
                className='centrar'
                style={{
                  width: '80%',
                  height: '480px',
                  borderRadius: '8px',
                  marginTop: '15px',
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
            </Col>
          </Row>
          <Button
            label='Confirmar'
            onClick={handleSubmit}
            severity='success'
            style={{ width: '100%', marginTop: '50 px' }}
          />
        </div>
      </div>
    </div>
  );
}
export default CalendarioVisita;
