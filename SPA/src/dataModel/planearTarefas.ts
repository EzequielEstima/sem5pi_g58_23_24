export interface PlanearTarefas {
    codDispositivo: string,
    tarefas: {
        tipoTarefa: string,
        id: string,
        emailRequisitor: string,
        salaInicial?: string,
        salaFinal?: string,
        codEdificio?: string,
        numeroPiso?: number
    }[]
}
