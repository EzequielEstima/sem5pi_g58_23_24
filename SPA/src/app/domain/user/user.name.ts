// Importações necessárias, se aplicável
import { Injectable } from '@angular/core';

interface UserNameProps {
    name: string;
}

export class UserName {
    private props: UserNameProps;

    private constructor(props: UserNameProps) {
        this.props = props;
    }

    public getValue(): string {
        return this.props.name;
    }

    /**
     * Verifica se o valor é nulo ou indefinido
     * @param value 
     * @returns 
     */
    private static isNullOrUndefined(value: string): boolean {
        return value === null || value === undefined;
    }

    /**
     *  Verifica se o nome de usuário é válido
     * @param name 
     * @returns 
     */
    private static isValidUsername(name: string): boolean {
        const regex = /^[a-zA-Z0-9]{3,20}$/;
        return regex.test(name);
    }

    public static create(name: string): UserName | null {
        if (UserName.isNullOrUndefined(name) || !UserName.isValidUsername(name)) {
            return null;
        }
        return new UserName({ name: name });
    }
}