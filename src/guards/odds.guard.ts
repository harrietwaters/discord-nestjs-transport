import { CanActivate, Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import { setClassName } from '../utilities/set-class-name';

@Injectable()
abstract class OddsGuard implements CanActivate {
    protected abstract numerator: number;
    protected abstract denominator: number;

    canActivate(): boolean {
        return _.random(1, this.denominator) <= this.numerator;
    }
}
export function Odds(numerator: number, denominator: number): typeof OddsGuard {
    class CustomOdds extends OddsGuard {
        protected numerator = numerator;
        protected denominator = denominator;
    }

    return setClassName(CustomOdds, `${numerator}-${denominator}`);
}
