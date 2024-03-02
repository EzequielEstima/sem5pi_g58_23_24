// Importações necessárias, se aplicável
import { Injectable } from '@angular/core';

interface RoleProps {
    tipo: string;
}

export class Role {
    private props: RoleProps;

    private constructor(props: RoleProps) {
        this.props = props;
    }

    public getValue(): string {
        return this.props.tipo;
    }

    private static isNullOrUndefined(value: string): boolean {
        return value === null || value === undefined;
    }

    private static isValidRole(tipo: string): boolean {
        const validRoles = ['gestor de campus', 'gestor de frota', 'gestor de tarefas', 'utente', 'admin'];
        return validRoles.includes(tipo);
    }

    public static create(tipo: string): Role | null {
        if (Role.isNullOrUndefined(tipo) || !Role.isValidRole(tipo)) {
            // A validação falhou, você pode lidar com isso como preferir
            return null;
        }

        return new Role({ tipo: tipo });
    }
}

// Assim como antes, a implementação específica de validação depende das suas regras de negócio
