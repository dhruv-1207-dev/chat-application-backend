import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

// tslint:disable-next-line:no-namespace
export namespace Validator {
  export class ValidatorMapping {
    public mapping(eventName: string) {
      return {
        requestOldMessages: GetOldChatMessage,
        emitNewUserMessage: SendNewMessageToUser,
      }[eventName];
    }
  }

  export class GetOldChatMessage {
    // Validation
    @IsNumber()
    @IsNotEmpty()
    public ticketId: number;

    @IsNumber()
    @IsNotEmpty()
    public page: number;

    @IsNumber()
    @IsNotEmpty()
    public limit: number;
  }

  export class SendNewMessageToUser {
    // Validation
    @IsString()
    @IsNotEmpty()
    public userId: string;

    @IsNotEmpty()
    public message: string;

    @IsNotEmpty()
    public name: string;
  }
}
