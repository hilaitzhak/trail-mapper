const Trail = require('../models/Trail');

class TrailService {
  static async getTrailById(trailId) {
    return await Trail.getTrailById(trailId);
  }

  static async getAllTrails() {
    return await Trail.getAllTrails();
  }
}

module.exports = TrailService;