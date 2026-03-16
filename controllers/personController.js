const Person = require("../models/Person");

//Get Tress 

exports.getTree = async (req, res) => {
    try {
  
      const buildTree = async (parentId = null) => {
  
        const persons = await Person.find({ parent: parentId });
  
        const tree = [];
  
        for (let person of persons) {
  
          const children = await buildTree(person._id);
  
          tree.push({
            _id: person._id,
            name: person.name,
            gender: person.gender,
            spouse: person.spouse,
            married: person.married,
            profileImage: person.profileImage,
            children: children
          });
  
        }
  
        return tree;
      };
  
      const familyTree = await buildTree();
  
      res.json(familyTree);
  
    } catch (error) {
  
      res.status(500).json({ message: error.message });
  
    }
  };


// CREATE PERSON
exports.createPerson = async (req, res) => {

  try {

    const { name, gender, parent } = req.body;

    const profileImage = req.file ? req.file.path : null;

    const person = new Person({
      name,
      gender,
      parent,
      profileImage
    });

    await person.save();

    if (parent) {

      const parentPerson = await Person.findById(parent);

      parentPerson.children.push(person._id);

      await parentPerson.save();
    }

    res.json(person);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};






// UPDATE PERSON
exports.updatePerson = async (req, res) => {

  try {

    const { id } = req.params;

    const updateData = req.body;

    if (req.file) {
      updateData.profileImage = req.file.path;
    }

    const updated = await Person.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    res.json(updated);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};

exports.addSpouse = async (req, res) => {

    try {
  
      const { id } = req.params;
      const { spouseName } = req.body;
  
      if (!spouseName) {
        return res.status(400).json({
          message: "Spouse name is required"
        });
      }
  
      const person = await Person.findById(id);
  
      if (!person) {
        return res.status(404).json({
          message: "Person not found"
        });
      }
  
      person.married = true;
      person.spouse = spouseName;
  
      await person.save();
  
      res.json({
        message: "Spouse added successfully",
        person
      });
  
    } catch (error) {
  
      res.status(500).json({
        message: error.message
      });
  
    }
  };


// DELETE PERSON
exports.deletePerson = async (req, res) => {

  try {

    const { id } = req.params;

    const person = await Person.findById(id);

    if (!person) {
      return res.status(404).json({
        message: "Person not found"
      });
    }

    if (person.parent) {

      const parent = await Person.findById(person.parent);

      parent.children = parent.children.filter(
        child => child.toString() !== id
      );

      await parent.save();
    }

    await Person.findByIdAndDelete(id);

    res.json({
      message: "Person deleted successfully"
    });

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};