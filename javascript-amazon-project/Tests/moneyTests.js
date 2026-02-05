import { formatCurrency } from "../scripts/utils/money.js";
describe('test suite : fromatCurrency',()=>{
    it('should format cents to dollars correctly',()=>{
        expect(formatCurrency(12345)).toEqual('123.45');
    })
    it('should format cents to dollars correctly with rounding and nearest cents',()=>{
        expect(formatCurrency(12344)).toEqual('123.44');
        expect(formatCurrency(2000.5)).toEqual('20.01');
    })
    it('should format cents to dollars correctly for zero cents',()=>{
        expect(formatCurrency(0)).toEqual('0.00');
    })

})