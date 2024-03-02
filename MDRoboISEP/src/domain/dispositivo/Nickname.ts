import { ValueObject } from "../../core/domain/ValueObject"
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";

interface nicknameProps {
    nickname: string;
}

export class Nickname extends ValueObject<nicknameProps> {
    private constructor (props : nicknameProps) {
        super(props)
    }

    public static create (nickname: string): Result<Nickname> {
        let guardResults: any[] = [];
        guardResults.push(Guard.isAlphanumeric(nickname,'Nickname do Dispositivo'));
        guardResults.push(Guard.stringLengthLessOrEqualThan(nickname,30,'Nickname do Dispositivo'));
        guardResults.push(Guard.againstNullOrUndefined(nickname,'Nickname do Dispositivo'));
        let guardFinal = Guard.combine(guardResults);        
        if (!guardFinal.succeeded) {
          return Result.fail<Nickname>(guardFinal.message);
        } else {
          return Result.ok<Nickname>(new Nickname({ nickname: nickname}))
        }
    }

}