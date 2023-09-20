import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "react-bootstrap";

function ConfCambaceo() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { register, handleSubmit, setValue, getValues } = useForm();

  const onSubmit = (data) => {
    setValue("address", data.address);
    setValue("date", data.date);
    setValue("time", data.time);
  };

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const FormPageStyle = {
    backgroundColor: "#f7f7f7",
    padding: "30px",
    borderRadius: "10px",
  };

  return (
    <div style={{ margin: "30px" }}>
      <h2>Confirmación de Cambaceo</h2>
      <form style={FormPageStyle} onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label>Dirección</label>
          <input className="form-control" type="text" name="address" ref={register} />
        </div>
        <div className="form-group">
          <label>Fecha</label>
          <input className="form-control" type="date" name="date" ref={register} />
        </div>
        <div className="form-group">
          <label>Hora</label>
          <input className="form-control" type="time" name="time" ref={register} />
        </div>
        <Button type="submit" style={{ backgroundColor: "#3b8f2b", borderColor: "#3b8f2b" }}>
          Confirmar
        </Button>
        <Button
          style={{ backgroundColor: "#007bff", borderColor: "#007bff", marginLeft: "10px" }}
          onClick={() => {
            setValue("address", getValues("address"));
            setValue("date", getValues("date"));
            setValue("time", getValues("time"));
          }}
        >
          Editar
        </Button>
      </form>
      <Modal isOpen={isModalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Confirmación</ModalHeader>
        <ModalBody>Se ha registrado el cambaceo</ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={toggleModal}>
            Aceptar
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default ConfCambaceo;
