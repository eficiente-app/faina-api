export default {
  id: {
    presence: {
      allowEmpty: false,
      message: "^ID não informado."
    },
    numericality: {
      notValid: "^ID inválido."
    }
  },
  nome: {
    presence: {
      allowEmpty: false,
      message: "^Nome não informado."
    },
    length: {
      maximum: 100,
      tooLong: "^Nome deve ter no máximo %{count} caracteres."
    }
  },
  descricao: {
    presence: {
      allowEmpty: false,
      message: "^Descrição não informada."
    },
    length: {
      maximum: 255,
      tooLong: "^Descrição deve ter no máximo %{count} caracteres."
    }
  },
  tipo: {
    presence: {
      allowEmpty: false,
      message: "^Tipo não informado."
    },
    numericality: {
      notValid: "^Tipo inválido."
    }
  }
};
