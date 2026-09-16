let greetings = [
  {
    id: 1,
    message: "Hello World",
  },
];
let nextId = 2;

module.exports = {
  findAll: () => greetings,
  findById: (id) => greetings.find((g) => g.id === Number(id)),
  create: (message) => {
    const newGreeting = { id: nextId++, message };
    greetings.push(newGreeting);
    return newGreeting;
  },
  update: (id, message) => {
    const greeting = greetings.find((g) => g.id === Number(id));
    if (!greeting) {
      return null;
    }
    greeting.message = message;
    return greeting;
  },
  remove: (id) => {
    const index = greetings.findIndex((g) => g.id === Number(id));
    if (index === -1) return false;
    greetings.splice(index, 1);
    return true;
  },
};
