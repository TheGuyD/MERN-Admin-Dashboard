import overallStat from "../models/OverallStat.js";

export const getSales = async (req, res) => {
  try {
    const overallStats = await overallStat.find();
    res.status(200).json(overallStats[0]);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};