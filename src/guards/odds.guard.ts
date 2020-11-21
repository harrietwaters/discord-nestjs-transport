import { CanActivate, Injectable } from '@nestjs/common';
import * as _ from 'lodash';

@Injectable()
export class OddsGuard implements CanActivate {
    private readonly numerator: number;
    private readonly denominator: number;
    constructor(numerator: number, denominator: number) {
        this.numerator = numerator;
        this.denominator = denominator;
    }
    canActivate(): boolean {
        return _.random(1, this.denominator) <= this.numerator;
    }
}
