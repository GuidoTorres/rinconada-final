import React from "react";
import { useState } from "react";
import { useContext } from "react";
import { PlanillaContext } from "../../../context/PlanillaContext";
import DragAndDrop from "../../personal/DragAndDrop";
import { AiOutlineClose, AiFillEye } from "react-icons/ai";

const ModalVerificacionAsociacion = ({ text }) => {
  const [avatar, setAvatar] = useState(null);
  const { verificacion, setVerificacion } = useContext(PlanillaContext);
  const date = new Date();
  const date1 = date.toISOString().split("T")[0];
  console.log(date1);

  const closeModal = () => {
    setVerificacion(false);
  };
  const handleSubmit = () => {};
  return (
    <div className="modal-verificacion">
      <div className="overlay"></div>
      <div className="modal-container">
        <section className="modal-header">
          {text}
          <AiOutlineClose onClick={closeModal} />
        </section>
        <section>
          <form className="modal-body" onSubmit={handleSubmit}>
            <section>
              <div>
                <label>Fecha: {date1}</label>

                <DragAndDrop
                  avatar={avatar}
                  setAvatar={setAvatar}
                  //   selected={dataToEdit}
                />
              </div>
              <div>
                <button>Registrar</button>
              </div>
            </section>
          </form>
        </section>
      </div>
    </div>
  );
};

export default ModalVerificacionAsociacion;
