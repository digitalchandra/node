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
            details: person.details,
            contact: person.contact,
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

    const { name, gender, parent, details, contact } = req.body;

    const profileImage = req.file ? req.file.path : null;

    const person = new Person({
      name,
      gender: gender.toLowerCase(), 
      parent: parent || null,
      details: details || "",
      profileImage
    });

    await person.save();

    if (parent) {

      const parentPerson = await Person.findById(parent);
    
      if (!parentPerson) {
        return res.status(404).json({ message: "Parent not found" });
      }
    
      //  Restrict female (daughter)
      if (parentPerson.gender === "female") {
        return res.status(400).json({
          message: "Cannot add child to a daughter"
        });
      }
    
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

// ad suppose 

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

    // Auto gender-based label
    if (person.gender === "female") {
      person.spouse = spouseName; // husband
    } else {
      person.spouse = spouseName; // wife
    }

    person.married = true;

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

const deleteRecursively = async (personId) => {
  const children = await Person.find({ parent: personId });

  for (let child of children) {
    await deleteRecursively(child._id);
  }

  await Person.findByIdAndDelete(personId);
};

exports.deletePerson = async (req, res) => {
  try {

    const { id } = req.params;

    const person = await Person.findById(id);

    if (!person) {
      return res.status(404).json({
        message: "Person not found"
      });
    }

    // Remove from parent
    if (person.parent) {
      const parent = await Person.findById(person.parent);
      if (parent) { 
        parent.children = parent.children.filter(
          child => child.toString() !== id
        );
        await parent.save();
      }
    }

    // Delete all descendants
    await deleteRecursively(id);

    res.json({
      message: "Person and descendants deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};