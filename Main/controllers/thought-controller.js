const { Thought, User } = require('../models');

const thoughtController = {
  // get all thoughts
  async getThoughts(req, res) {
    try {
      const dbThoughtData = await Thought.find()
        .sort({ createdAt: -1 });

      res.json(dbThoughtData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // get single thought by id
  async getSingleThought(req, res) {
    try {
      const dbThoughtData = await Thought.findOne({ _id: req.params.thoughtId });

      if (!dbThoughtData) {
        return res.status(404).json({ message: 'No thought with this id!' });
      }

      res.json(dbThoughtData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // create a thought
  async createThought(req, res) {
    try {
      const dbThoughtData = await Thought.create(req.body);

      const dbUserData = await User.findOneAndUpdate(
        { _id: req.body.userId },
        { $push: { thoughts: dbThoughtData._id } },
        { new: true }
      );

      if (!dbUserData) {
        return res.status(404).json({ message: 'Thought created but no user with this id!' });
      }

      res.json({ message: 'Thought successfully created!' });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // update thought
  async updateThought(req, res) {
    const dbThoughtData = await Thought.findOneAndUpdate({ _id: req.params.thoughtId }, { $set: req.body }, { runValidators: true, new: true });

    if (!dbThoughtData) {
      return res.status(404).json({ message: 'No thought with this id!' });
    }

    res.json(dbThoughtData);

    console.log(err);
    res.status(500).json(err);
  },
// delete thought
async deleteThought(req, res) {
  try {
    // Use findOneAndDelete instead of findOneAndRemove
    const dbThoughtData = await Thought.findOneAndDelete({ _id: req.params.thoughtId });

    if (!dbThoughtData) {
      return res.status(404).json({ message: 'No thought with this id!' });
    }

    // Remove thought id from user's `thoughts` field
    const dbUserData = await User.findOneAndUpdate(
      { thoughts: req.params.thoughtId },  // Find the user that has this thought in the `thoughts` array
      { $pull: { thoughts: req.params.thoughtId } },  // Remove the thought from the array
      { new: true }  // Return the updated document
    );

    if (!dbUserData) {
      return res.status(404).json({ message: 'Thought deleted but no user with this thought!' });
    }

    // If everything succeeds, return a success message
    res.json({ message: 'Thought successfully deleted!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred', error: err.message });
  }
},
  // add a reaction to a thought
  async addReaction(req, res) {
    try {
      const dbThoughtData = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      );

      if (!dbThoughtData) {
        return res.status(404).json({ message: 'No thought with this id!' });
      }

      res.json(dbThoughtData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // remove reaction from a thought
  async removeReaction(req, res) {
    try {
      const dbThoughtData = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { runValidators: true, new: true }
      );

      if (!dbThoughtData) {
        return res.status(404).json({ message: 'No thought with this id!' });
      }

      res.json(dbThoughtData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
};

module.exports = thoughtController;
