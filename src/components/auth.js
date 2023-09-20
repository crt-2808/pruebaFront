import React from 'react'

const auth = (props) => {
  return (
    <div className="Auth-form-container">
      <form className="Auth-form">
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Ingresar</h3>
          <div className="form-group mt-3">
            <label>Email o ID</label>
            <input
              type="email"
              className="form-control mt-1"
              placeholder="Mail"
            />
          </div>
          <div className="form-group mt-3">
            <label>Contraseña</label>
            <input
              type="password"
              className="form-control mt-1"
              placeholder="Contraseña"
            />
          </div>
          <div className="d-grid gap-2 mt-3">
            <button type="submit" className="btn btn-primary">
              Enviar
            </button>
          </div>
          <p className="forgot-password text-right mt-2">
            Recuperar <a href="#">contraseña?</a>
            
          </p>
        </div>
      </form>
    </div>
  )
}

export default auth