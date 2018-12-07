module.exports = class goat {

  constructor(name, email) {
      this.name = name;
      this.email = email;
  };
  get() {
      return this.name + " and " + this.email;
  };
};

//example of a class export