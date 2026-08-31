/* =====================================================
   EVALUACIÓN - DISTRIBUCIÓN
===================================================== */

#examForm {
  display: flex;
  flex-direction: column;
  gap: 28px;
  width: 100%;
}


/* TARJETA DE PREGUNTA */

.question {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 18px;

  padding: 28px;

  display: flex;
  flex-direction: column;
  gap: 24px;

  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    background 0.2s ease;
}

.question:hover {
  border-color: rgba(255, 255, 255, 0.22);
  background: rgba(255, 255, 255, 0.08);
}


/* CABECERA DE PREGUNTA */

.question-header {
  display: flex;
  align-items: flex-start;
  gap: 18px;
}


/* NÚMERO */

.question-number {
  flex-shrink: 0;

  width: 48px;
  height: 48px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 13px;

  background: rgba(255, 255, 255, 0.08);

  font-size: 14px;
  font-weight: 700;
  letter-spacing: 1px;
}


/* TEXTO PREGUNTA */

.question-title {
  flex: 1;
}

.question-title small {
  display: block;

  margin-bottom: 7px;

  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1.2px;

  opacity: 0.55;
}

.question-title h3 {
  margin: 0;

  font-size: 18px;
  line-height: 1.55;
  font-weight: 600;
}


/* =====================================================
   RESPUESTAS
===================================================== */

.options-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.option {
  position: relative;

  display: flex;
  align-items: center;

  gap: 14px;

  min-height: 58px;

  padding: 15px 18px;

  border-radius: 13px;

  border: 1px solid rgba(255, 255, 255, 0.10);

  background: rgba(0, 0, 0, 0.12);

  cursor: pointer;

  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;
}

.option:hover {
  background: rgba(255, 255, 255, 0.07);
  border-color: rgba(255, 255, 255, 0.22);

  transform: translateY(-1px);
}


/* RADIO ORIGINAL OCULTO */

.option input {
  position: absolute;

  opacity: 0;
  pointer-events: none;
}


/* RADIO PERSONALIZADO */

.option-control {
  width: 20px;
  height: 20px;

  flex-shrink: 0;

  border-radius: 50%;

  border: 2px solid rgba(255, 255, 255, 0.4);

  position: relative;

  transition: 0.2s ease;
}


/* RADIO SELECCIONADO */

.option input:checked + .option-control {
  border-color: #ffffff;
}

.option input:checked + .option-control::after {
  content: "";

  position: absolute;

  width: 10px;
  height: 10px;

  border-radius: 50%;

  background: #ffffff;

  top: 50%;
  left: 50%;

  transform: translate(-50%, -50%);
}


/* RESPUESTA SELECCIONADA */

.option:has(input:checked) {
  background: rgba(255, 255, 255, 0.10);
  border-color: rgba(255, 255, 255, 0.35);
}


/* TEXTO RESPUESTA */

.option-text {
  flex: 1;

  font-size: 15px;
  line-height: 1.45;
}


/* =====================================================
   BOTÓN FINAL
===================================================== */

.exam-actions {
  margin-top: 10px;

  padding-top: 26px;

  border-top: 1px solid rgba(255, 255, 255, 0.10);

  display: flex;
  justify-content: flex-end;
}

#submitButton {
  min-width: 220px;

  min-height: 52px;

  border: none;
  border-radius: 13px;

  font-size: 15px;
  font-weight: 700;

  cursor: pointer;
}

#submitButton:disabled {
  opacity: 0.6;
  cursor: wait;
}


/* =====================================================
   CELULAR
===================================================== */

@media (max-width: 700px) {

  #examForm {
    gap: 20px;
  }

  .question {
    padding: 20px 17px;
    gap: 20px;
  }

  .question-header {
    gap: 13px;
  }

  .question-number {
    width: 40px;
    height: 40px;
  }

  .question-title h3 {
    font-size: 16px;
  }

  .option {
    min-height: 55px;

    padding: 14px 15px;
  }

  .exam-actions {
    justify-content: stretch;
  }

  #submitButton {
    width: 100%;
  }

}
