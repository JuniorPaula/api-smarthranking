import { BadRequestException, PipeTransform } from '@nestjs/common';
import { ChallengeStatus } from '../interfaces/challenge-status.enum';

export class ChallengeStatusValidation implements PipeTransform {
  readonly validStatus = [
    ChallengeStatus.ACEITO,
    ChallengeStatus.NEGADO,
    ChallengeStatus.CANCELADO,
  ];
  transform(value: any) {
    const status = value.status ? value.status.toUpperCase() : 'INVÁLIDO';
    if (!this.isValidStatus(status)) {
      throw new BadRequestException(`O status ${status} não é permitido!`);
    }

    return value;
  }

  private isValidStatus(status: ChallengeStatus): boolean {
    const index = this.validStatus.indexOf(status);
    return index !== -1;
  }
}
