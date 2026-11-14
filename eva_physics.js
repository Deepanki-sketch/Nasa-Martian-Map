/**
 * NASA Space Apps Challenge 2026 - Kasukabe Defence Group
 * EVA Life-Support Physics & Metabolic Engine
 * 
 * Implements quantitative formulas adapted from:
 * - NASA Human Research Program (HRP) EVA Guidelines
 * - NASA STD-3001 (Space Flight Human-System Standard)
 * - Martian Biomechanics (0.372g gravity, 135kg suited astronaut mass)
 */

class EVAPhysicsEngine {
  constructor(options = {}) {
    // Suit & Consumables Capacity
    this.totalOxygenLiters = options.totalO2 || 480; // Standard 8-hour PLSS supply at nominal rate
    this.remainingOxygenLiters = this.totalOxygenLiters;
    
    this.totalBatteryWattHours = options.totalBattery || 1200; // 1.2 kWh Li-ion pack
    this.remainingBatteryWh = this.totalBatteryWattHours;
    
    this.totalCoolingWaterKg = options.totalWater || 4.5; // Water sublimator feed
    this.remainingCoolingWaterKg = this.totalCoolingWaterKg;

    // Environmental Parameters (Gale Crater baseline)
    this.gravity = 0.372; // Earth g
    this.suitedMassKg = 135; // 75kg astronaut + 60kg NASA Exploration Extravehicular Mobility Unit (xEMU)
    this.ambientTempC = -48;
    
    // Safety Margins (NASA Mandate)
    this.reserveTimeMinutes = 45; // 45-minute mandatory return contingency
    this.maxSafeSlopeDegrees = 15.0; // Slope limit for suited astronaut stability

    // Mission State
    this.elapsedMinutes = 0;
    this.distanceTraveledKm = 0;
    this.currentElevationM = -4460;
    this.currentSlopeDeg = 2.1;
    this.currentHeartRateBpm = 82;
    this.currentMetabolicRateKcalHr = 280;
    
    // Status State
    this.abortTriggered = false;
    this.abortReason = null;
  }

  /**
   * Calculates adjusted walking speed on Mars considering incline
   * Based on modified Tobler's Martian Hiking Function
   */
  calculateWalkingSpeed(slopeDegrees) {
    const baseSpeedFlatKmH = 3.2; // Typical suited pace on flat regolith
    if (slopeDegrees <= 0) {
      // Gentle downslope aids walking slightly, steep downslope requires braking
      if (slopeDegrees > -8) return baseSpeedFlatKmH * 1.1;
      return Math.max(1.2, baseSpeedFlatKmH * (1 - Math.abs(slopeDegrees) * 0.05));
    }
    // Uphill reduces speed non-linearly
    const speed = baseSpeedFlatKmH * Math.exp(-0.075 * slopeDegrees);
    return Math.max(0.8, Number(speed.toFixed(2))); // Min crawl speed 0.8 km/h
  }

  /**
   * Calculates metabolic rate (kcal/hr) based on slope and speed
   * Nominal: 250 - 320 kcal/hr
   * High exertion: > 450 kcal/hr
   */
  calculateMetabolicRate(slopeDegrees, speedKmH) {
    const basalMetabolism = 110; // kcal/hr
    const workComponent = 45 * speedKmH;
    const slopeWork = Math.max(0, slopeDegrees) * 18.5; // Incline penalty under 0.38g
    const totalRate = basalMetabolism + workComponent + slopeWork;
    return Math.min(650, Math.round(totalRate));
  }

  /**
   * Oxygen burn rate in Liters per minute based on metabolic expenditure
   * Standard conversion: ~0.20 to 0.25 L O2 consumed per 100 kcal of metabolic work
   */
  calculateOxygenBurnRateLitersPerMin(metabolicRateKcalHr) {
    const litersPerHour = (metabolicRateKcalHr / 100) * 0.22 * 60 * 0.0166;
    return litersPerHour / 60; // L/min
  }

  /**
   * Evaluates the critical "Walkback Horizon" (Point of No Return)
   * Distance D from closest safe habitat or pressurized rover
   */
  evaluateWalkbackHorizon(distanceToSafetyKm) {
    const emergencyReturnSpeedKmH = 3.5; // Brisk emergency traverse pace
    const returnTimeMinutes = (distanceToSafetyKm / emergencyReturnSpeedKmH) * 60;
    const totalRequiredTimeMinutes = returnTimeMinutes + this.reserveTimeMinutes;

    // Estimate O2 needed for return at brisk pace (~360 kcal/hr)
    const returnO2BurnRate = this.calculateOxygenBurnRateLitersPerMin(360);
    const oxygenNeededLiters = totalRequiredTimeMinutes * returnO2BurnRate;

    // Estimate Battery needed for return (~380 Watts load)
    const batteryNeededWh = (totalRequiredTimeMinutes / 60) * 380;

    const oxygenMarginLiters = this.remainingOxygenLiters - oxygenNeededLiters;
    const batteryMarginWh = this.remainingBatteryWh - batteryNeededWh;

    const isBreached = oxygenMarginLiters <= 0 || batteryMarginWh <= 0;

    return {
      distanceToSafetyKm: Number(distanceToSafetyKm.toFixed(2)),
      returnTimeMinutes: Math.round(returnTimeMinutes),
      totalSafeBufferMinutes: Math.round(totalRequiredTimeMinutes),
      oxygenNeededLiters: Number(oxygenNeededLiters.toFixed(1)),
      oxygenMarginLiters: Number(oxygenMarginLiters.toFixed(1)),
      batteryMarginWh: Math.round(batteryMarginWh),
      isBreached: isBreached,
      safetyStatus: isBreached ? "CRITICAL_ABORT" : (oxygenMarginLiters < 20 ? "CAUTION" : "NOMINAL")
    };
  }

  /**
   * Steps the mission simulation forward by a given time delta
   */
  simulateStep(deltaMinutes, targetSlopeDeg, distanceToSafetyKm) {
    this.elapsedMinutes += deltaMinutes;
    this.currentSlopeDeg = targetSlopeDeg;
    
    const speedKmH = this.calculateWalkingSpeed(targetSlopeDeg);
    const distanceStepKm = (speedKmH * (deltaMinutes / 60));
    this.distanceTraveledKm += distanceStepKm;

    // Metabolic update
    this.currentMetabolicRateKcalHr = this.calculateMetabolicRate(targetSlopeDeg, speedKmH);
    this.currentHeartRateBpm = Math.min(175, Math.round(72 + (this.currentMetabolicRateKcalHr - 200) * 0.24));

    // Consumables depletion
    const o2Consumed = this.calculateOxygenBurnRateLitersPerMin(this.currentMetabolicRateKcalHr) * deltaMinutes;
    this.remainingOxygenLiters = Math.max(0, this.remainingOxygenLiters - o2Consumed);

    // Battery depletion (Suit heaters + fan + life support avionics = ~340W - 420W)
    const wattDraw = targetSlopeDeg > 12 ? 410 : 350;
    const whConsumed = (wattDraw * deltaMinutes) / 60;
    this.remainingBatteryWh = Math.max(0, this.remainingBatteryWh - whConsumed);

    // Cooling water sublimation (~0.35 - 0.65 kg/hr based on body heat)
    const waterConsumedKg = (this.currentMetabolicRateKcalHr / 850) * (deltaMinutes / 60);
    this.remainingCoolingWaterKg = Math.max(0, this.remainingCoolingWaterKg - waterConsumedKg);

    // Check Walkback Horizon
    const walkback = this.evaluateWalkbackHorizon(distanceToSafetyKm);

    // Hazard checks
    if (targetSlopeDeg > this.maxSafeSlopeDegrees && !this.abortTriggered) {
      this.abortTriggered = true;
      this.abortReason = `SLOPE GRADE EXCEEDED: ${targetSlopeDeg}° (Maximum safe suit limit: ${this.maxSafeSlopeDegrees}°)`;
    } else if (walkback.isBreached && !this.abortTriggered) {
      this.abortTriggered = true;
      this.abortReason = "WALKBACK HORIZON BREACHED: Consumables insufficient to guarantee 45-min reserve upon return to Habitat!";
    }

    return {
      elapsedMinutes: this.elapsedMinutes,
      distanceTraveledKm: Number(this.distanceTraveledKm.toFixed(2)),
      speedKmH: speedKmH,
      slopeDeg: targetSlopeDeg,
      metabolicRate: this.currentMetabolicRateKcalHr,
      heartRate: this.currentHeartRateBpm,
      remainingO2Percent: Math.round((this.remainingOxygenLiters / this.totalOxygenLiters) * 100),
      remainingBatteryPercent: Math.round((this.remainingBatteryWh / this.totalBatteryWattHours) * 100),
      remainingWaterPercent: Math.round((this.remainingCoolingWaterKg / this.totalCoolingWaterKg) * 100),
      walkback: walkback,
      abort: {
        triggered: this.abortTriggered,
        reason: this.abortReason
      }
    };
  }

  reset() {
    this.remainingOxygenLiters = this.totalOxygenLiters;
    this.remainingBatteryWh = this.totalBatteryWattHours;
    this.remainingCoolingWaterKg = this.totalCoolingWaterKg;
    this.elapsedMinutes = 0;
    this.distanceTraveledKm = 0;
    this.abortTriggered = false;
    this.abortReason = null;
  }
}

// Export to window/module
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EVAPhysicsEngine;
}
