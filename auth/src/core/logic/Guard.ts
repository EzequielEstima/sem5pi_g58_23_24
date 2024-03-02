import config from "../../../config";

export interface IGuardResult {
  succeeded: boolean;
  message?: string;
}

export interface IGuardArgument {
  argument: any;
  argumentName: string;
}

export type GuardArgumentCollection = IGuardArgument[];

export class Guard {
  public static isValidDomainName(email: string, arg1: string) {
    const allowedDomains = config.allowedEmails?.split(',') || [];
    const emailDomain = email.split('@')[1];
    if (allowedDomains.includes(emailDomain)){
      return { succeeded: true };
    }
    return { succeeded: false, message: `O ${arg1} não é um válido ou aceite pelo sistema.` };
  }

  public static combine(guardResults: IGuardResult[]): IGuardResult {
    for (let result of guardResults) {
      if (result.succeeded === false) return result;
    }

    return { succeeded: true };
  }

  public static againstNullOrUndefined(argument: any, argumentName: string): IGuardResult {
    if (argument === null || argument === undefined) {
      return { succeeded: false, message: `${argumentName} é nulo ou indefinido` }
    } else {
      return { succeeded: true }
    }
  }

  public static againstNullOrUndefinedBulk(args: GuardArgumentCollection): IGuardResult {
    for (let arg of args) {
      const result = this.againstNullOrUndefined(arg.argument, arg.argumentName);
      if (!result.succeeded) return result;
    }
    return { succeeded: true }
  }

  public static isOneOf(value: any, validValues: any[], argumentName: string): IGuardResult {
    let isValid = false;
    for (let validValue of validValues) {
      if (value === validValue) {
        isValid = true;
      }
    }

    if (isValid) {
      return { succeeded: true }
    } else {
      return {
        succeeded: false,
        message: `${argumentName} não é um dos valores válidos: ${JSON.stringify(validValues)}. Obteve-se: ${value}.`
      }
    }
  }

  public static inRange(num: number, min: number, max: number, argumentName: string): IGuardResult {
    const isInRange = num >= min && num <= max;
    if (!isInRange) {
      return { succeeded: false, message: `${argumentName} não está dentro do intervalo ${min} e ${max}.` }
    } else {
      return { succeeded: true }
    }
  }

  public static allInRange(numbers: number[], min: number, max: number, argumentName: string): IGuardResult {
    let failingResult: IGuardResult = null;
    for (let num of numbers) {
      const numIsInRangeResult = this.inRange(num, min, max, argumentName);
      if (!numIsInRangeResult.succeeded) failingResult = numIsInRangeResult;
    }

    if (failingResult) {
      return { succeeded: false, message: `${argumentName} não está dentro do intervalo.` }
    } else {
      return { succeeded: true }
    }
  }

/**
 * Validates a number to be greater than zero.
 * @param num 
 * @param argumentName 
 * @returns 
 */
  public static numberGreaterThanZero(num: number, argumentName: string): IGuardResult {
    if (num > 0) {
      return { succeeded: true };
    } else {
      return { succeeded: false, message: `${argumentName} must be greater than 0.` };
    }
  }


  /**
   * Validates a string to be a valid email address. A valid email address is a string containing an @ symbol, followed by a domain name and a top-level domain.
   * @param email 
   * @param argumentName 
   * @returns 
   */
  public static againtInvalidEmail(email: string, argumentName: string): IGuardResult {
    const regEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // taken from https://www.w3resource.com/javascript/form/email-validation.php

    if (regEx.test(email)) {
      return { succeeded: true }
    } else {
      return { succeeded: false, message: `O ${argumentName} não é um email válido` }
    }
  }

  /**
   *  Validates a string to be a valid phone number format. A valid phone number is a string containing only numbers, spaces, dashes, dots and parentheses. 
   * @param input 
   * @param fieldName 
   * @returns 
   */
  public static againstInvalidPhoneFormat(input: string, fieldName: string): IGuardResult {
    const phoneRegex = /9[1236][0-9]{7}|2[1-9][0-9]{7}/; // regex from https://www.portugal-a-programar.pt/forums/topic/51048-express%C3%A3o-regular-para-valida%C3%A7%C3%A3o-de-n%C3%BAmeros-de-telefone/

    if (!phoneRegex.test(input)) {
      return { succeeded: false, message: `O numero de ${fieldName} não tem um formato portugues valido.` };
    }

    return { succeeded: true };
  }

  /**
   * Validates a string to be a valid username. A valid username is a string with at least 2 characters and at most 30 characters, containing only letters and spaces.
   * @param input 
   * @param fieldName 
   * @returns 
   */
  public static againstInvalidUsername(input: string, fieldName: string): IGuardResult {
    const usernameRegex = /^[a-zA-Z ]{2,100}$/;

    if (!usernameRegex.test(input)) {
      return { succeeded: false, message: `O ${fieldName} inserido não é um nome válido ou aceite pelo sistema.` };
    }

    return { succeeded: true };
  }

  /**
   *  Validates a portuguese NIF (Número de Identificação Fiscal). Inspired by https://gist.github.com/eresende/88562d2c4dc85b62cb0c
   * @param nif A string containing the NIF to validate
   * @param fieldName A string that will be used in the error message
   * @returns 
   */
  public static againstInvalidNIF(nif: string, fieldName: string): IGuardResult { 
    if (nif.length !== 9 || !/^[0-9]+$/.test(nif)) {
      return { succeeded: false, message: `O ${fieldName} tem que ter 9 digitos.` };
    }

    const validStartDigits = ['1', '2', '3', '5', '6', '8', '45', '70', '71', '72', '77', '79', '90', '91', '98', '99'];
    if (!validStartDigits.some(d => nif.startsWith(d))) {
      return { succeeded: false, message: `O ${fieldName} tem que começar com um destes digitos: ${validStartDigits.join(', ')}.` };
    }
  /*
    const total = [...nif].slice(0, 8).reduce((acc, curr, i) => acc + parseInt(curr) * (9 - i), 0);
    const modulo11 = total % 11;
    const comparador = modulo11 < 2 ? 0 : 11 - modulo11;
    const ultimoDigito = parseInt(nif.charAt(8));

    if (ultimoDigito !== comparador) {
      return { succeeded: false, message: `The last digit of ${fieldName} does not satisfy the checksum.` };
    }*/

    return { succeeded: true };
  }

  public static isPasswordGreaterOrEqualThan(value: string, length: number): IGuardResult {
    if (value.length >= length){
      return { succeeded: true };
    }
    return { succeeded: false, message: `A password tem que ter ${length} ou mais caracteres` };
  }

  public static passwordContainsUppercaseLetter(password: string): IGuardResult {
    if (/[A-Z]/.test(password)){
      return { succeeded: true };
    }
    return { succeeded: false, message: `A password tem que ter pelo menos uma letra maiúscula` };
  }

  public static passwordContainsLowercaseLetter(password: string): IGuardResult {
    if (/[a-z]/.test(password)) {
      return { succeeded: true };
    }
    return { succeeded: false, message: `A password tem que ter pelo menos uma letra minúscula` };
  }

  public static passwordContainsDigit(password: string): IGuardResult {
    if  (/\d/.test(password)) {
      return { succeeded: true };
    }
    return { succeeded: false, message: `A password tem que ter pelo menos um número` };
  }

  public static passwordContainsSymbol(password: string): IGuardResult {
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return { succeeded: true };
    }
    return { succeeded: false, message: `A password tem que ter pelo menos um símbolo ou caracter especial` };
  }

}