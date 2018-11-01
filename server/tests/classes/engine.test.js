import Engine from '../../src/classes/engine';
import { System } from "../../src/classes/generic";
import HeatMixin from '../../src/classes/generic/heatMixin';

describe('Engine', () => {

  test('should throw if called without the \'new\' operator', () => {
    expect(() => { const d = Engine(); }).toThrow(/Cannot call a class as a function/);
  });

  test('should extend Heat which extends System', () => {
    // Note: Test may not pass with minified code
    const parent1 = Object.getPrototypeOf((new Engine().constructor));
    const parent2 = Object.getPrototypeOf(parent1);
    expect(parent1.name).toBe('Heat')
    expect(parent2.name).toBe('System')
  });

  describe('constructor', () => {   
    test('should set default parameters', () => {
      const e = new Engine();
      expect(e.class).toBe('Engine');
      expect(e.type).toBe('Engine');
      expect(e.on).toBe(false);
      expect(e.speeds).toEqual([]);
      expect(e.speed).toBe(-1);
      expect(e.previousSpeed).toBe(0);
      expect(e.useAcceleration).toBe(false);
      expect(e.speedFactor).toBe(1250);
      expect(e.acceleration).toBe(0);
      expect(e.cooling).toBe(false);
      expect(e.displayName).toBe('null Engine');  // This is actually a cool name

      const e2 = new Engine({ name: 'Ion' });
      expect(e2.displayName).toBe('Ion Engine');
    });
  });

  describe('stealthFactor', () => {
    test('should get the stealth factor', () => {
      const e1 = new Engine();
      expect(e1.stealthFactor).toBe(0);

      // TODO: Finish this once we know how speeds work
    });
  });

  describe('break', () => {
    test('should stop all engines', () => {
      // TODO: What exactly is this doing?
    });

    test('should call super', () => {
      const e = new Engine();
      e.break();
      expect(e.damage.damaged).toBe(true);
    });
  });

  describe('setPower', () => {
    test('should override set power to change speed when power is changed', () => {
      // TODO: This is doing something with other engines too, seems fishy
    });
  });

  describe('setSpeed', () => {
    test('should set the speed', () => {
      // TODO: Finish this
      // TODO: This method contains a setTimeout, that seems really risky
    });
  });

});

