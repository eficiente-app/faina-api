class HelperMessage {

  public fieldsNotSentToEdit (): string {
    return "Campos não informados para editar!";
  }

  public notFoundForRead (): string {
    return "Registro não encontrado para exibir!";
  }

  public notFoundForUpdate (): string {
    return "Registro não encontrado para editar!";
  }

  public notFoundForDelete (): string {
    return "Registro não encontrado para excluir!";
  }

  public successCreate (): string {
    return "Criado com sucesso!";
  }

  public successUpdate (): string {
    return "Alterado com sucesso!";
  }

  public successDelete (): string {
    return "Excluído com sucesso!";
  }

  public successExecution (): string {
    return "Executado com sucesso!";
  }
}
export default HelperMessage;
