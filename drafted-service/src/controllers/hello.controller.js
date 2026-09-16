const Hello = require("./../models/hello.model");

exports.getAll = (req, res) => {
  res.status(200).json(Hello.findAll());
};

exports.getOne = (req, res) => {
  const greeting = Hello.findById(req.params.id);
  if (!greeting) {
    return res.status(404).json({ error: "Greeting not found!" });
  }
  res.status(200).json(greeting);
};

exports.create = (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }
  const created = Hello.create(message);
  res.status(201).json(created);
};

exports.update = (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }
  const updated = Hello.update(req.params.id, message);
  if (!updated) {
    return res.status(404).json({ error: "Greeting not found!" });
  }
  res.status(200).json(updated);
};

exports.remove = (req, res) => {
  const removed = Hello.remove(req.params.id);
  if (!removed) {
    return res.status(404).json({ error: "Greeting not found!" });
  }
  res.status(204).send();
};
