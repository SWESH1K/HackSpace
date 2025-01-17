export const getRounds = async(req, res) => {
    try {
        const allRounds = req.event.rounds
        res.status(200).json({success: true, data: allRounds})
    } catch(error) {
        res.status(500).json({success: false, message: `Server Error: ${error}`})
    }
}

export const addRound = async (req, res) => {
    const round = req.body;
  
    if (!round.number) {
      return res.status(400).json({ success: false, message: "Round number is required" });
    }
  
    try {
      const existingRound = req.event.rounds.find(r => r.number === round.number);
      if (existingRound) {
        return res.status(400).json({ success: false, message: `Round with number ${round.number} already exists` });
      }
  
      req.event.rounds.push(round);
      await req.event.save();
      res.status(200).json({ success: true, data: req.event });
    } catch (error) {
      if (error.name == "ValidationError") {
        res.status(400).json({ success: false, message: error.message });
      } else {
        res.status(500).json({ success: false, message: `Server Error: ${error}` });
      }
    }
  };