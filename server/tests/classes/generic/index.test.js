import { Engine } from '../../../src/classes/engine';

import { System } from "../../../src/classes/generic";
import DamageStep from "../../../src/classes/generic/damageStep";


describe('System', () => {

  describe('constructor', () => {    
  
    test('should throw if called without the \'new\' operator', () => {
      expect(() => { const sys = System(); }).toThrow(/Cannot call a class as a function/);
    });

    test('should create an instance of System', () => {
      const sys = new System();
      expect(sys.class).toBe('System');
      expect(sys.type).toBe('System');
      expect(sys).toBeInstanceOf(System);
    });

    test('should set default parameters', () => {
      const sys = new System();
      expect(sys.id).toEqual(expect.stringMatching(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/));
      expect(sys.simulatorId).toBeNull();
      expect(sys.name).toBeNull();
      expect(sys.power).toEqual({
        power: 5,
        powerLevels: [5],
        defaultLevel: 0
      });
      expect(sys.extra).toBe(false);
      expect(sys.locations).toEqual([]);
      expect(sys.requiredDamageSteps).toEqual([]);
      expect(sys.optionalDamageSteps).toEqual([]);
    });

    test('should clone params.power', () => {
      const power = {
        power: 50,
        powerLevels: [50],
        defaultLevel: 0
      };
      const sys = new System({ power: power });
      expect(sys.power).not.toBe(power);
      expect(sys.power).toEqual(power);
    });

    test('should convert DamageSteps', () => {
      var reqDmgStps = [
        { name: 'Differentiate girdle springs' },
        { name: 'Mitigate side-fumbling' },
        { name: 'Deploy logarithmic casings' }
      ];

      var optDmgStps = [
        { name: 'Negate relative motion of conductors' },
        { name: 'Engage panametric fan' }
      ];

      const sys = new System({ requiredDamageSteps: reqDmgStps, optionalDamageSteps: optDmgStps });
      expect(sys.requiredDamageSteps[0].name).toBe(reqDmgStps[0].name);
      expect(sys.requiredDamageSteps[0]).toBeInstanceOf(DamageStep);
      
      expect(sys.optionalDamageSteps[1].name).toBe(optDmgStps[1].name);
      expect(sys.optionalDamageSteps[0]).toBeInstanceOf(DamageStep);
    });

  });

  describe('updateName', () => {
    test('should update the name', () => {
      const sys = new System({ name: 'Lunar Waneshaft' });
      expect(sys.name).toBe('Lunar Waneshaft');
      expect(sys.displayName).toBe('Lunar Waneshaft');
      sys.updateName({ displayName: 'Ambifacient Lunar Waneshaft' });
      expect(sys.displayName).toBe('Ambifacient Lunar Waneshaft');
      sys.updateName({ name: '' });
      expect(sys.name).toBe('');
          
    });
  });

  describe('locations', () => {
    test('should update locations', () => {
      const sys = new System();
      const locs = ['Here', 'There', 'Anywhere']
      sys.updateLocations(locs);
      expect(sys.locations).toBe(locs);
    });
  });

  describe('setPower', () => {
    test('should update power', () => {
      const sys = new System();
      sys.setPower(0.4);
      expect(sys.power.power).toBe(0.4);
    });
  });

  describe('setPowerLevels and setDefaultPowerLevel', () => {
    test('should set power levels', () => {
      const sys = new System();
      const levels = [10,20,30,40,50];
      sys.setPowerLevels(levels);
      expect(sys.power.powerLevels).toBe(levels);
    });

    test('should set default power level and decrease it if necessary', () => {
      const sys = new System();
      const levels = [10,20,30,40,50];
      sys.setPowerLevels(levels);
      sys.setDefaultPowerLevel(3);
      expect(sys.power.defaultLevel).toBe(3);
      sys.setPowerLevels([8,16]);
      expect(sys.power.defaultLevel).toBe(1);
    });
  });

  describe('break', () => {
    test('should break a System', () => {
      const sys = new System();
      sys.break('It is broken', false, 'not_sure_what_this_parameter_means');
      expect(sys.damage.damaged).toBe(true);
    });

    test('should produce a damage report', () => {
      const sys = new System();
      sys.break('It is broken', false, 'not_sure_what_this_parameter_means');
      expect(sys.damage.report).toBe('It is broken');
    });
  });

  describe('addDamageStep', () => {
    test('should add a step', () => {
      const sys = new System();
      sys.addDamageStep({ name: 'Align tremie bearing', type: 'required' });
      expect(sys.requiredDamageSteps[0].constructor.name).toBe('DamageStep');
      expect(sys.requiredDamageSteps[0].name).toBe('Align tremie bearing');
      
      sys.addDamageStep({ name: 'Spin marzle vanes', type: 'required' });
      expect(sys.requiredDamageSteps[1].name).toBe('Spin marzle vanes');
    });
  });

  describe('updateDamageStep', () => {
    test('should update a step', () => {
      const sys = new System();
      sys.addDamageStep({ name: 'Align tremie bearing', type: 'required' });
      sys.addDamageStep({ name: 'Spin marzle vanes', type: 'required' });
      sys.addDamageStep({ name: 'Synchronize the cardinal grammeter', type: 'optional' });
      const id0 = sys.requiredDamageSteps[0].id;
      const id1 = sys.requiredDamageSteps[1].id;
      const id2 = sys.optionalDamageSteps[0].id;
      sys.updateDamageStep({ id: id0, args: { myArg: 'test_args0' } });
      sys.updateDamageStep({ id: id1, args: { myArg: 'test_args1' } });
      sys.updateDamageStep({ id: id2, args: { myArg: 'test_args2' } });
      expect(sys.requiredDamageSteps[0].args.myArg).toBe('test_args0');
      expect(sys.requiredDamageSteps[1].args.myArg).toBe('test_args1');
      expect(sys.optionalDamageSteps[0].args.myArg).toBe('test_args2');
    });

    describe('removeDamageStep', () => {
      test('should remove a step', () => {
        const sys = new System();
        sys.addDamageStep({ name: 'Align tremie bearing', type: 'required' });
        sys.addDamageStep({ name: 'Spin marzle vanes', type: 'required' });
        const id0 = sys.requiredDamageSteps[0].id;
        const id1 = sys.requiredDamageSteps[1].id;
        expect(sys.requiredDamageSteps.length).toBe(2);
        sys.removeDamageStep(id0);
        expect(sys.requiredDamageSteps.length).toBe(1);
        expect(sys.requiredDamageSteps[0].name).toBe('Spin marzle vanes');
      });
    });

    describe('generateDamageReport', () => {
      // TODO: This is hard to test without a complete Simulation
    });

    // TODO: Finish these
  });



});
