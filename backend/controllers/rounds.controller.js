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
  
    if (!round.name) {
      return res.status(400).json({ success: false, message: "Round name is required" });
    }
  
    try {
      const existingRound = req.event.rounds.find(r => r.name === round.name);
      if (existingRound) {
        return res.status(400).json({ success: false, message: `Round with name ${round.name} already exists` });
      }
  
      req.event.rounds.push(round);
      await req.event.save();
      res.status(200).json({ success: true, data: round });
    } catch (error) {
      if (error.name == "ValidationError") {
        res.status(400).json({ success: false, message: error.message });
      } else {
        res.status(500).json({ success: false, message: `Server Error: ${error}` });
      }
    }
  };

  export const deleteRound = async (req, res) => {
    const { name } = req.body;
  
    if (!name) {
      return res.status(400).json({ success: false, message: "Round name is required" });
    }
  
    try {
      const roundIndex = req.event.rounds.findIndex((r) => r.name === name);
      if (roundIndex === -1) {
        return res.status(404).json({ success: false, message: `Round with name "${name}" not found` });
      }
  
      req.event.rounds.splice(roundIndex, 1);
      await req.event.save();
  
      res.status(200).json({ success: true, data: req.event.rounds });
    } catch (error) {
      res.status(500).json({ success: false, message: `Server Error: ${error}` });
    }
  };