
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
  public static combine (guardResults: IGuardResult[]): IGuardResult {
    for (let result of guardResults) {
      if (result.succeeded === false) return result;
    }

    return { succeeded: true };
  }

  public static againstNullOrUndefined (argument: any, argumentName: string): IGuardResult {
    if (argument === null || argument === undefined) {
      return { succeeded: false, message: `${argumentName} is null or undefined` }
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

  public static isOneOf (value: any, validValues: any[], argumentName: string) : IGuardResult {
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
        message: `${argumentName} isn't oneOf the correct types in ${JSON.stringify(validValues)}. Got "${value}".` 
      }
    }
  }

  public static inRange (num: number, min: number, max: number, argumentName: string) : IGuardResult {
    const isInRange = num >= min && num <= max;
    if (!isInRange) {
      return { succeeded: false, message: `${argumentName} is not within range ${min} to ${max}.`}
    } else {
      return { succeeded: true }
    }
  }

  public static allInRange (numbers: number[], min: number, max: number, argumentName: string) : IGuardResult {
    let failingResult: IGuardResult = null;
    for(let num of numbers) {
      const numIsInRangeResult = this.inRange(num, min, max, argumentName);
      if (!numIsInRangeResult.succeeded) failingResult = numIsInRangeResult;
    }

    if (failingResult) {
      return { succeeded: false, message: `${argumentName} is not within the range.`}
    } else {
      return { succeeded: true }
    }
  }

  public static stringLengthLessOrEqualThan(inputString: string | null | undefined, max: number, argumentName: string): IGuardResult {
    if (inputString === null || inputString === undefined || inputString.length <= max) {
      return { succeeded: true };
    } else {
      return { succeeded: false, message: `${argumentName} must be null, empty, or have a length less than ${max}.` };
    }
  }

  public static numberGreaterThanZero(num: number, argumentName: string): IGuardResult {
    if (num > 0) {
      return { succeeded: true };
    } else {
      return { succeeded: false, message: `${argumentName} must be greater than 0.` };
    }
  }
  public static isAlphanumericWithSpaces(inputString: string, argumentName: string): IGuardResult {
    const regex = /^[a-zA-Z0-9 ]+$/
    if(regex.test(inputString)){
      return { succeeded: true };
    }else{
      return { succeeded: false, message: `${argumentName} deve ser alfanumérico e pode conter espaços.`};
    }
  }

  public static isAlphanumeric(inputString: string, argumentName: string): IGuardResult {
    const regex = /^[a-zA-Z0-9]+$/
    if(regex.test(inputString)){
      return { succeeded: true };
    }else{
      return { succeeded: false, message: `${argumentName} deve ser alfanumérico.`};
    }
  }

  public static arrayHasGreaterLengthThan(inputArray: any[], length: number, argumentName: string): IGuardResult {
    if(inputArray.length > length){
      return { succeeded: true };
    }else{
      return { succeeded: false, message: `${argumentName} deve ter um tamanho superior a ${length}.`};
    }
  }

  public static arrayHasSpecificLength(inputArray: any[], length: number, argumentName: string): IGuardResult {
    if(inputArray.length === length){
      return { succeeded: true };
    }else{
      return { succeeded: false, message: `${argumentName} deve ter um tamanho igual a ${length}.`};
    }
  }
  
  public static isPatternValidIdPonto(inputString: string, argumentName: string): IGuardResult {
    const regex = /^-?[a-zA-Z0-9 ]+\.[0-9]+\.[0-9]+$/;
    if (regex.test(inputString)) {
        return { succeeded: true };
    } else {
        return { succeeded: false, message: `${argumentName} deve ter o formato XXX.aa.xxx.`};
    }
  }

  public static numberGreaterOrEqualsZero(num: number, argumentName: string): IGuardResult {
    if (num >= 0) {
      return { succeeded: true };
    } else {
      return { succeeded: false, message: `${argumentName} must be greater than 0.` };
    }
  }

  public static valueRepeatedInArray(inputArray: any[], argumentName: string): IGuardResult {
    let result = false;
    for(let i = 0; i < inputArray.length; i++){
      for(let j = i+1; j < inputArray.length; j++){
        if(inputArray[i] === inputArray[j]){
          result = true;
        }
      }
    }
    if(result){
      return { succeeded: false, message: `${argumentName} não pode ter valores repetidos.` };
    }else{
      return { succeeded: true };
    }
  }

  public static booleanIsTrue(flag: boolean, argumentName : string): IGuardResult {
    if(!flag){
      return { succeeded: false, message: `${argumentName} must be true.` };
    }else{
      return { succeeded: true };
    }
  }
}